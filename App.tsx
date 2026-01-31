import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GoogleAuthModule, { useGoogleAuth } from '@thewoowon/google-rn';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PerfMonitorProvider, useRenderCount } from 'react-native-perf-hud';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertModal } from '@components/modules';
import { AuthProvider, ThemeProvider } from '@contexts/index';
import { PermissionProvider } from '@contexts/PermissionContext';
import { ToastProvider } from '@contexts/ToastContext';
import { ModalProvider, useModal } from '@contexts/ModalContext';
import { SessionProvider } from '@contexts/SessionContext';

// Google OAuth 설정
import {
  IOS_GOOGLE_CLIENT_ID,
  ANDROID_GOOGLE_CLIENT_ID,
  IOS_GOOGLE_REDIRECT_URI,
  ANDROID_GOOGLE_REDIRECT_URI,
} from '@env';

import { Platform } from 'react-native';
import { UserProvider } from '@contexts/UserContext';
import { RootNavigator } from './src/navigations';
import { NavigationContainer } from '@react-navigation/native';

const clientId = Platform.select({
  ios: IOS_GOOGLE_CLIENT_ID,
  android: ANDROID_GOOGLE_CLIENT_ID,
  default: '',
});

const redirectUri = Platform.select({
  ios: IOS_GOOGLE_REDIRECT_URI,
  android: ANDROID_GOOGLE_REDIRECT_URI,
  default: '',
});

const GOOGLE_CLIENT_ID = clientId!;
const GOOGLE_REDIRECT_URI = redirectUri!;

const queryClient = new QueryClient();

function AppContent() {
  const result = useGoogleAuth();
  const { user, loading, signIn, signOut, isAuthenticated, getAccessToken } =
    useGoogleAuth();

  const render = useRenderCount('AppContent');

  useEffect(() => {
    // Google OAuth 설정 (앱 시작시 한번만)
    GoogleAuthModule.configure({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: GOOGLE_REDIRECT_URI,
      scopes: ['openid', 'profile', 'email'],
    }).catch((error: Error) => {
      console.error('[App] Google Auth configuration failed:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: '#FF6B6B',
            background: '#FFFFFF',
            card: '#FFFFFF',
            text: '#000000',
            border: '#E5E5E5',
            notification: '#FF6B6B',
          },
          fonts: {
            regular: {
              fontFamily: 'Pretendard-Regular',
              fontWeight: 'normal',
            },
            medium: {
              fontFamily: 'Pretendard-Medium',
              fontWeight: 'normal',
            },
            bold: {
              fontFamily: 'Pretendard-Bold',
              fontWeight: 'normal',
            },
            heavy: {
              fontFamily: 'Pretendard-ExtraBold',
              fontWeight: 'normal',
            },
          },
        }}
      >
        <UserProvider>
          <RootNavigator />
        </UserProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <PermissionProvider>
              <ModalProvider>
                <SessionProvider>
                  <AppContent />
                  <GlobalModalRenderer />
                </SessionProvider>
              </ModalProvider>
            </PermissionProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

// GlobalModalRenderer.tsx
const GlobalModalRenderer = () => {
  const { isVisible, message, onConfirm, hideModal } = useModal();

  if (!isVisible) return null;

  return (
    <AlertModal
      visible={isVisible}
      message={message}
      onConfirm={() => {
        onConfirm?.();
        hideModal();
      }}
    />
  );
};
