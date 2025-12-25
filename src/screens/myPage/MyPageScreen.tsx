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
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import Header from '@components/layout/Header';
import { useUser } from '@contexts/UserContext';

const MyPageScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const { setIsAuthenticated } = useAuth();
  const { scale } = useTheme();
  const [isSpeechBoxVisible, setIsSpeechBoxVisible] = useState(false);
  const { user } = useUser();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <Header
          title="마이페이지"
          onPress={() => navigation.goBack()}
          isBack={true}
        />
        <View
          style={[
            styles.flexBox,
            styles.flexColumn,
            {
              paddingHorizontal: 20,
              paddingVertical: 18,
            },
          ]}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              overflow: 'hidden',
            }}
          >
            <Image
              source={
                user?.photoUrl
                  ? { uri: `${API_PREFIX}${user.photoUrl}` }
                  : require('@assets/images/default_profile.png')
              }
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.nameText}>{user?.name}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          <View
            style={[
              styles.carbohydrateBox,
              {
                marginTop: 8,
                backgroundColor: 'rgba(93, 182, 100, 0.1)',
                paddingHorizontal: 8,
                paddingVertical: 4,
              },
            ]}
          >
            <Text style={styles.carbohydrateBoxText}>보유 코인</Text>
            <Text style={styles.carbohydrateBoxValueText}>0 코인</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
          }}
        >
          <Pressable
            style={styles.listBox}
            onPress={() =>
              navigation.navigate('Ticket', {
                screen: 'TicketScreen',
              })
            }
          >
            <Text style={styles.listText}>보관함</Text>
            <RightChevronIcon color="#212121" />
          </Pressable>
          <Pressable
            style={styles.listBox}
            onPress={async () => {
              const result = await confirm(
                '로그아웃',
                '로그아웃 하시겠습니까?',
              );
              if (result) {
                await logout();
                setIsAuthenticated(false);
              }
            }}
          >
            <Text style={styles.listText}>로그아웃</Text>
            <RightChevronIcon color="#212121" />
          </Pressable>
        </View>
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
