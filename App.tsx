/**
 * MovieAndMe App with Google Auth
 */

import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Image,
  NativeModules,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGoogleAuth } from '@thewoowon/google-rn';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Google OAuth 설정
const { GoogleAuthModule } = NativeModules;
import {
  IOS_GOOGLE_CLIENT_ID,
  ANDROID_GOOGLE_CLIENT_ID,
  IOS_GOOGLE_REDIRECT_URI,
  ANDROID_GOOGLE_REDIRECT_URI,
} from '@env';

import { Platform } from 'react-native';

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

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const { user, loading, signIn, signOut, isAuthenticated, getAccessToken } =
    useGoogleAuth();

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

  const handleSignIn = async () => {
    try {
      await signIn();
      Alert.alert('성공', '구글 로그인 성공!');
    } catch (error) {
      console.error('[App] Sign in error:', error);
      Alert.alert('오류', '로그인에 실패했습니다.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('성공', '로그아웃 되었습니다.');
    } catch (error) {
      console.error('[App] Sign out error:', error);
      Alert.alert('오류', '로그아웃에 실패했습니다.');
    }
  };

  const handleGetToken = async () => {
    const token = await getAccessToken();
    if (token) {
      Alert.alert('Access Token', token.substring(0, 100) + '...');
    } else {
      Alert.alert('토큰 없음', '유효한 액세스 토큰이 없습니다.');
    }
  };

  useEffect(() => {
    console.log('[App] User state changed:', user);
  }, [user]);

  useEffect(() => {
    console.log('[App] Authentication state changed:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 Movie & Me</Text>
        <Text style={styles.subtitle}>with Google Sign-In</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩중...</Text>
        </View>
      ) : isAuthenticated && user ? (
        <View style={styles.userContainer}>
          {user.photoUrl && (
            <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
          )}
          <Text style={styles.welcomeText}>환영합니다!</Text>
          <Text style={styles.userName}>{user.name || '사용자'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="액세스 토큰 보기"
              onPress={handleGetToken}
              color="#4285F4"
            />
            <View style={styles.buttonSpacer} />
            <Button title="로그아웃" onPress={handleSignOut} color="#DB4437" />
          </View>
        </View>
      ) : (
        <View style={styles.signInContainer}>
          <Text style={styles.description}>
            구글 계정으로 로그인하여 {'\n'}
            영화 추천을 받아보세요!
          </Text>
          <Button
            title="Google로 로그인"
            onPress={handleSignIn}
            color="#4285F4"
          />
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by @openauth/google-rn</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
  },
  buttonSpacer: {
    height: 12,
  },
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default App;
