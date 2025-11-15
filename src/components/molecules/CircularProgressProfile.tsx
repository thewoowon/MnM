import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type CircularProgressProfileProps = {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0 ~ 1
  duration?: number;
  onClick?: () => void;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressProfile = ({
  size = 150,
  strokeWidth = 8,
  progress = 0.75, // 0 ~ 1
  duration = 1000,
  onClick = () => {},
}: CircularProgressProfileProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* 애니메이션 원 */}
        <AnimatedCircle
          stroke="#5DB664"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Image
          source={require(`../../assets/images/magam_example_2.png`)} // 프로필 이미지 경로
          style={{ width: 122, height: 122, borderRadius: 100 }} // 이미지 스타일
          resizeMode="cover"
        />
      </View>
      <Pressable
        onPress={onClick}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <Rect x="1" y="1" width="38" height="38" rx="19" fill="#212121" />
          <Rect
            x="1"
            y="1"
            width="38"
            height="38"
            rx="19"
            stroke="#F6F6F6"
            strokeWidth="2"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.4925 10C26.953 10 27.4092 10.0904 27.8346 10.2666C28.2601 10.4429 28.6471 10.7016 28.9728 11.0272C29.2984 11.3529 29.5571 11.7398 29.7334 12.1654C29.9095 12.5908 30 13.0471 30 13.5075L29.9964 13.6802C29.9766 14.0819 29.8876 14.4783 29.7334 14.8506C29.5791 15.2228 29.3618 15.5655 29.0918 15.8635L28.9728 15.9878L16.6034 28.3572C16.4907 28.4699 16.3501 28.5515 16.1963 28.5934L11.1569 29.9678C10.8399 30.0542 10.5008 29.9639 10.2684 29.7316C10.0361 29.4992 9.94585 29.1601 10.0322 28.8431L11.4066 23.8037L11.445 23.691C11.4909 23.5814 11.5582 23.4811 11.6428 23.3966L24.0122 11.0272L24.1374 10.9082C24.4354 10.6383 24.7781 10.4208 25.1503 10.2666C25.5758 10.0904 26.0319 10 26.4925 10ZM26.4925 11.8325C26.2725 11.8325 26.0542 11.8763 25.8509 11.9605C25.6986 12.0236 25.5565 12.1085 25.4295 12.2128L25.3078 12.3228L13.1102 24.5195L12.2217 27.7774L15.4796 26.8889L27.6772 14.6922L27.7872 14.5705C27.8915 14.4434 27.9773 14.3015 28.0404 14.1491C28.1246 13.9459 28.1675 13.7274 28.1675 13.5075L28.1594 13.3438C28.1434 13.1802 28.1035 13.0193 28.0404 12.8669C27.9563 12.6637 27.8327 12.4784 27.6772 12.3228C27.5218 12.1675 27.337 12.0446 27.134 11.9605C26.9308 11.8763 26.7125 11.8325 26.4925 11.8325Z"
            fill="white"
          />
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgressProfile;
