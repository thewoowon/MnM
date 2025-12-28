import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MenuIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20V8H4V6ZM4 11H20V13H4V11ZM20 16H4V18H20V16Z" fill={color} />
  </Svg>
);

export default MenuIcon;
