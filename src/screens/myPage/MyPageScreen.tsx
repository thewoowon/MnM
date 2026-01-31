import { RightChevronIcon } from '@components/Icons';
import CircularProgressProfile from '@components/molecules/CircularProgressProfile';
import { useTheme } from '@contexts/ThemeContext';
import useAuth from '@hooks/useAuth';
import { confirm } from '@utils/confirm';
import React, { use, useState } from 'react';
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
import { logout } from '@screens/auth/auth';
import { useQuery } from '@tanstack/react-query';
import customAxios from '@axios/customAxios';
import { API_PREFIX } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@components/layout/Header';
import { useUser } from '@contexts/UserContext';

const MyPageScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const { setIsAuthenticated } = useAuth();
  const { user } = useUser();

  const deleteAccount = async () => {
    const response = await customAxios.delete(`${API_PREFIX}/users/me`);
    return response.data;
  };

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
              backgroundColor: 'white',
              marginBottom: 24,
            }}
          >
            <Image
              source={
                user?.photoUrl
                  ? { uri: user.photoUrl }
                  : require('@assets/images/default_profile.png')
              }
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.nameText}>{user?.name}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
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
          <Pressable
            style={styles.listBox}
            onPress={async () => {
              const result = await confirm(
                '회원탈퇴',
                '정말 회원탈퇴 하시겠습니까?',
              );
              if (result) {
                await deleteAccount();
                Alert.alert('회원탈퇴가 완료되었습니다.');
                await logout();
                setIsAuthenticated(false);
              }
            }}
          >
            <Text style={styles.listText}>회원탈퇴</Text>
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
  nameText: {
    color: '#F8F5CC',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
    marginTop: 2,
  },
  emailText: {
    color: '#F8F5CC',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.01,
    marginTop: 4,
  },
  listBox: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listText: {
    color: '#F8F5CC',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'GalmuriMono9',
    letterSpacing: -0.1,
  },
});

export default MyPageScreen;
