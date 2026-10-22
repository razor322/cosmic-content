import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type ShootingStarProps = {
  startFrame: number;
  color: string;
  length: number;
};

const TRAVEL_FRAMES = 22;

export const ShootingStar: React.FC<ShootingStarProps> = ({startFrame, color, length}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0 || local > TRAVEL_FRAMES) {
    return null;
  }
  const progress = local / TRAVEL_FRAMES;
  const fromX = width * 0.84;
  const fromY = height * 0.16;
  const toX = width * 0.24;
  const toY = height * 0.4;
  const headX = fromX + (toX - fromX) * progress;
  const headY = fromY + (toY - fromY) * progress;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const opacity = local < 4 ? local / 4 : Math.max(0, 1 - (local - (TRAVEL_FRAMES - 8)) / 8);

  return (
    <div
      style={{
        position: 'absolute',
        left: headX,
        top: headY,
        width: length,
        height: 2,
        background: `linear-gradient(to right, transparent, ${color})`,
        transform: `rotate(${angle}rad) translateX(-${length}px)`,
        transformOrigin: 'left center',
        opacity,
      }}
    />
  );
};
