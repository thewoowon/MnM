import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LeftArrowIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 13L20 11L8 11L8 9L6 9L6 11L4 11L4 13L6 13L6 15L8 15L8 13L20 13ZM10 17L8 17L8 15L10 15L10 17ZM10 17L12 17L12 19L10 19L10 17ZM10 7L8 7L8 9L10 9L10 7ZM10 7L12 7L12 5L10 5L10 7Z"
      fill={color}
    />
  </Svg>
);

export default LeftArrowIcon;
