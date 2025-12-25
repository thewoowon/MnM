import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RefreshIcon = ({ width = 24, height = 24, color = '#E5E5E5' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 2H14V4H16V6H4V8H2V13H4V8H16V10H14V12H16V10H18V8H20V6H18V4H16V2ZM6 20H8V22H10V20H8V18H20V16H22V11H20V16H8V14H10V12H8V14H6V16H4V18H6V20Z"
      fill={color}
    />
  </Svg>
);

export default RefreshIcon;
