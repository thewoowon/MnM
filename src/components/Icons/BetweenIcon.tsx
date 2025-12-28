import React from 'react';
import Svg, { Rect } from 'react-native-svg';

const BetweenIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect
      x="12"
      y="9.17188"
      width="4"
      height="4"
      transform="rotate(45 12 9.17188)"
      fill="#F8F5CC"
    />
  </Svg>
);

export default BetweenIcon;
