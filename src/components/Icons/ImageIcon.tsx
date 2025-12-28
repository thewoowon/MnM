import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ImageIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 3H2V21H22V3H4ZM20 5V19H4V5H20ZM14 9H12V11H10V13H8V15H6V17H8V15H10V13H12V11H14V13H16V15H18V13H16V11H14V9ZM8 7H6V9H8V7Z"
      fill={color}
    />
  </Svg>
);

export default ImageIcon;
