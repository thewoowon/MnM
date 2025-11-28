import {
  AppleIcon,
  CoinIcon,
  DetailIcon,
  KakaoIcon,
  NaverIcon,
  RightChevronIcon,
  XIcon,
} from '@components/Icons';
import CircularProgressProfile from '@components/molecules/CircularProgressProfile';
import { useTheme } from '@contexts/ThemeContext';
import useAuth from '@hooks/useAuth';
import { confirm } from '@utils/confirm';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { logout } from '@services/auth';
import { useQuery } from '@tanstack/react-query';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
// import BottomSheet, {
//   BottomSheetView,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyPageScreen = ({ navigation, route }: any) => {
  const { setIsAuthenticated } = useAuth();
  const { scale } = useTheme();
  const [isSpeechBoxVisible, setIsSpeechBoxVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View
          style={[
            styles.flexBox,
            styles.flexColumn,
            {
              paddingHorizontal: 20,
              paddingVertical: 18,
            },
          ]}
        ></View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  carbohydrateText: {
    color: '#5DB664',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Bold',
    lineHeight: 24,
    marginTop: 14,
  },
  nameText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 28,
    marginTop: 2,
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
    marginTop: 4,
  },
  carbohydrateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
  },
  carbohydrateBoxText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
  carbohydrateBoxValueText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 24,
  },
  coinBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
    backgroundColor: '#FFF0D1',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  coinText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
  },
  coinNumber: {
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
    lineHeight: 24,
  },
  listBox: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
    color: '#212121',
  },
  underText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
});

export default MyPageScreen;
