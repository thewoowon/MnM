import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BookMarkIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 2H6V4H18V20H16V18H14V16H10V18H8V20H6V2H4V22H8V20H10V18H14V20H16V22H20V2H18Z"
      fill={color}
    />
  </Svg>
);

export default BookMarkIcon;
