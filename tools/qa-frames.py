"""Measures a rendered frame against the palette rules of the series brief.

The classification is hue based, not nearest neighbour: a blend of two tokens
is still a blend of those two hues and should count as a mixture, not as one of
them.

Usage: python tools/qa-frames.py out/frame0.png [more.png ...]
"""
import sys
from collections import deque

import numpy as np
from PIL import Image

LIMITS = {
    "space.base": (55, 65),
    "cosmic.indigo": None,
    "nebula.purple": None,
    "cosmic.indigo+nebula.purple": (25, 30),
    "stellar.magenta": (0, 10),
    "solar.coral": (0, 5),
}

NAMES = [
    "space.base",
    "cosmic.indigo",
    "nebula.purple",
    "stellar.magenta",
    "solar.coral",
    "star.white",
]


def classify(pixels):
    """Assigns every pixel to a palette family by hue, value and saturation."""
    maximum = pixels.max(axis=-1)
    minimum = pixels.min(axis=-1)
    delta = maximum - minimum
    value = maximum
    saturation = np.where(maximum > 0, delta / np.maximum(maximum, 1e-6), 0)

    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    hue = np.zeros_like(value)
    is_red = maximum == red
    is_green = maximum == green
    hue = np.where(is_red, ((green - blue) / np.maximum(delta, 1e-6)) % 6, hue)
    hue = np.where(is_green, (blue - red) / np.maximum(delta, 1e-6) + 2, hue)
    hue = np.where(
        ~is_red & ~is_green, (red - green) / np.maximum(delta, 1e-6) + 4, hue
    )
    hue = (hue * 60) % 360

    index = np.zeros(value.shape, dtype=int)
    index = np.where(value < 0.11, 0, index)
    bright_neutral = (value >= 0.11) & (saturation < 0.25)
    index = np.where(bright_neutral, 5, index)
    coloured = (value >= 0.11) & (saturation >= 0.25)
    index = np.where(coloured & (hue >= 225) & (hue < 265), 1, index)
    index = np.where(coloured & (hue >= 265) & (hue < 300), 2, index)
    index = np.where(coloured & (hue >= 300) & (hue < 350), 3, index)
    index = np.where(coloured & ((hue >= 350) | (hue < 25)), 4, index)
    return index


def count_clusters(mask):
    visited = np.zeros_like(mask, dtype=bool)
    clusters = 0
    ys, xs = np.nonzero(mask)
    for y, x in zip(ys, xs):
        if visited[y, x]:
            continue
        clusters += 1
        queue = deque([(y, x)])
        visited[y, x] = True
        while queue:
            cy, cx = queue.popleft()
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1]:
                    if mask[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
    return clusters


def rel_luminance(rgb):
    s = np.asarray(rgb, dtype=float) / 255.0
    s = np.where(s <= 0.04045, s / 12.92, ((s + 0.055) / 1.055) ** 2.4)
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]


def analyze(path):
    image = Image.open(path).convert("RGB")
    width, height = image.size
    pixels = np.asarray(image).astype(np.float32) / 255.0
    luminance = 0.2126 * pixels[:, :, 0] + 0.7152 * pixels[:, :, 1] + 0.0722 * pixels[:, :, 2]

    index = classify(pixels)
    counts = {
        name: float((index == position).mean() * 100)
        for position, name in enumerate(NAMES)
    }
    counts["cosmic.indigo+nebula.purple"] = counts["cosmic.indigo"] + counts["nebula.purple"]

    coral_mask = index == 4
    coral_clusters = count_clusters(coral_mask)

    warm = (
        (pixels[:, :, 0] > 0.8) & (pixels[:, :, 1] > 0.78) & (pixels[:, :, 2] > 0.8)
    )
    ys, xs = np.nonzero(warm)

    print(f"== {path} ({width}x{height})")
    print(
        "   luminance mean %.3f  p5 %.3f  p95 %.3f   near-black %.2f%%"
        % (
            luminance.mean(),
            np.percentile(luminance, 5),
            np.percentile(luminance, 95),
            (luminance < 0.04).mean() * 100,
        )
    )
    for key, limit in LIMITS.items():
        value = counts[key]
        if limit is None:
            print(f"       {key:<30} {value:5.1f}%")
            continue
        low, high = limit
        mark = "ok " if low <= value <= high else "OUT"
        print(f"   {mark} {key:<30} {value:5.1f}%   (limit {low}-{high}%)")
    print(f"   coral clusters in frame: {coral_clusters}")
    if len(xs):
        print(
            "   bright text bbox x %d..%d  y %d..%d  (safe zone x 60..%d, y 220..%d)"
            % (xs.min(), xs.max(), ys.min(), ys.max(), width - 120, height - 380)
        )


for argument in sys.argv[1:]:
    analyze(argument)
