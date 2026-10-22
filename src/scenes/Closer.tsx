import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShockwaveRing} from '../components/ShockwaveRing.tsx';
import {SpaceWash} from '../components/SpaceWash.tsx';
import {Stars} from '../components/Stars.tsx';
import {Title} from '../components/Title.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {tailDrift} from '../lib/loopMotion.ts';
import {STAR_LAYERS} from '../lib/starLayers.ts';
import {sceneSlot} from '../lib/timeline.ts';
import {BODY_FONT} from '../theme/fonts.ts';
import {mix, type Palette} from '../theme/palette.ts';

export type CloserSceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  ctaText: string;
};

const TAIL_START = 90;

export const CloserScene: React.FC<CloserSceneProps> = ({palette, seed, ctaText}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const slot = sceneSlot('closer');
  const globalFrame = slot.from + frame;

  const collapse = interpolate(frame, [0, 70], [1, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pointRadius = interpolate(frame, [0, 55, 150, 215], [0, width * 0.032, width * 0.026, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringRadius = interpolate(frame, [30, 120], [width * 0.05, width * 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(frame, [30, 48, 120], [0, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleProgress = interpolate(frame, [40, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleFade = interpolate(frame, [180, 235], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tailOpacity = interpolate(frame, [TAIL_START, TAIL_START + 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const drift = tailDrift(globalFrame, fps, width);
  const starColour = mix(palette['star.white'], palette['stellar.magenta'], 0.15);
  const cx = width / 2;
  const cy = height * 0.46;

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <SpaceWash
        colour={palette['nebula.purple']}
        strength={interpolate(frame, [0, 120], [0.5, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
        centerRatio={0.46}
        radiusX={50}
        radiusY={30}
      />
      <SpaceWash
        colour={palette['cosmic.indigo']}
        strength={interpolate(frame, [100, 190], [0, 0.62], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
        centerRatio={0.6}
        radiusX={49}
        radiusY={29}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${collapse})`,
          transformOrigin: '50% 46%',
        }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <radialGradient id="collapseCloud">
              <stop offset="0%" stopColor={palette['stellar.magenta']} stopOpacity={0.75} />
              <stop offset="55%" stopColor={palette['nebula.purple']} stopOpacity={0.3} />
              <stop offset="100%" stopColor={palette['nebula.purple']} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={width * 0.42} fill="url(#collapseCloud)" />
        </svg>
      </AbsoluteFill>

      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="coralPoint">
            <stop offset="0%" stopColor={palette['star.white']} stopOpacity={0.95} />
            <stop offset="32%" stopColor={palette['solar.coral']} stopOpacity={0.9} />
            <stop offset="100%" stopColor={palette['solar.coral']} stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={pointRadius * 6} fill="url(#coralPoint)" opacity={0.5} />
        <circle cx={cx} cy={cy} r={pointRadius} fill={palette['solar.coral']} opacity={0.95} />
      </svg>

      <ShockwaveRing
        radius={ringRadius}
        opacity={ringOpacity}
        color={palette['solar.coral']}
      />

      {STAR_LAYERS.map((layer) => (
        <Stars
          key={layer.layer}
          seed={seed + layer.seedOffset}
          count={layer.count}
          layer={layer.layer}
          color={starColour}
          opacity={layer.opacity * tailOpacity}
          driftX={drift}
          sizeScale={layer.sizeScale}
        />
      ))}

      <Title progress={titleProgress} fadeOut={titleFade} palette={palette} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '61%',
          textAlign: 'center',
          fontFamily: BODY_FONT,
          fontSize: 28,
          fontWeight: 500,
          letterSpacing: '0.28em',
          color: palette['star.white'],
          opacity: (1 - titleFade) * 0.9,
          textTransform: 'uppercase',
          textShadow: `0 2px 24px ${palette['space.base']}`,
        }}
      >
        {ctaText}
      </div>

      <Vignette color={palette['space.base']} strength={0.62} openRatio={60} />
    </AbsoluteFill>
  );
};
