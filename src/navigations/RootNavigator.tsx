import React, { useEffect } from 'react';
import AuthStack from './AuthStack'; // 인증 스택
import MainTab from './MainTab'; // 메인 스택
import { useAuth } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// App.tsx 또는 Root.tsx 등 진입점

import { useModal } from '@contexts/ModalContext';
import customAxios, { setAuthFailureHandler } from '@axios/customAxios';
import { useUser } from '@contexts/UserContext';
import { API_PREFIX } from '@env';

const RootNavigator = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // AuthContext에서 상태 가져오기
  const { user, setUser } = useUser();
  const modal = useModal(); // 모달 컨텍스트 사용

  type NavigationProp = StackNavigationProp<{
    Main: { screen: 'MainScreen' };
  }>;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      console.log('isAuthenticated changed:', isAuthenticated);
      console.log('Current user:', user);
      if (isAuthenticated && !user) {
        try {
          const res = await customAxios.get(`${API_PREFIX}/users/me`);
          console.log('Fetched user data:', res.data);
          setUser({
            email: res.data.data.email,
            name: res.data.data.name,
            photoUrl: res.data.data.profile_pic,
          });

          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs', params: { screen: 'MainScreen' } }],
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsAuthenticated(false);
        }
      } else if (isAuthenticated && user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Tabs', params: { screen: 'MainScreen' } }],
        });
      }
    };
    redirectBasedOnRole();
  }, [isAuthenticated, user]);

  useEffect(() => {
    setAuthFailureHandler(() => {
      modal.showModal('세션이 만료되었습니다. 다시 로그인해주세요.', () => {
        setIsAuthenticated(false);
      });
    });
  }, []);

  return isAuthenticated ? <MainTab /> : <AuthStack />;
};

export default RootNavigator;
