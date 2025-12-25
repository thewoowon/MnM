import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ProfileIcon = ({ width = 24, height = 24, color = '#F8F5CC' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 2H9V4H7V10H9V4H15V2ZM15 10H9V12H15V10ZM15 4H17V10H15V4ZM4 16H6V14H18V16H6V20H18V16H20V22H4V16Z"
      fill={color}
    />
  </Svg>
);

export default ProfileIcon;
