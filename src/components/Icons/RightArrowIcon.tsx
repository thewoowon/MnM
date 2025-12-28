import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RightArrowIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 11V13H16V15H18V13H20V11H18V9H16V11H4ZM14 7H16V9H14V7ZM14 7H12V5H14V7ZM14 17H16V15H14V17ZM14 17H12V19H14V17Z"
      fill={color}
    />
  </Svg>
);

export default RightArrowIcon;
