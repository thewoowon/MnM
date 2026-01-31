import React, { useEffect, useState, type ReactElement } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { useAuth } from '../../hooks';
import SocialLoginButton from '@components/molecules/SocialLoginButton';
import Icon from '@components/atoms/icon/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_PREFIX } from '@env';
import customAxios from '@axios/customAxios';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@contexts/ToastContext';
import { login, logout } from '@screens/auth/auth';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { theme } from '@contexts/theme';
import { useUser } from '@contexts/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleAuthModule, {
  GoogleUser,
  useGoogleAuth,
} from '@thewoowon/google-rn';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { LogoTitleIcon } from '@components/Icons';

const Gap = (): ReactElement => <View style={{ marginTop: 24 }} />;
const ResponseJsonText = ({
  json = {},
  name,
}: {
  json?: object;
  name: string;
}): ReactElement => (
  <View
    style={{
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      backgroundColor: '#242c3d',
    }}
  >
    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
      {name}
    </Text>
    <Text style={{ color: 'white', fontSize: 13, lineHeight: 20 }}>
      {JSON.stringify(json, null, 4)}
    </Text>
  </View>
);

type IntroViewProps = {
  result: string;
};

function IntroView({ result }: IntroViewProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>{result}</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const SignInScreen = ({ navigation, route: _route }: any) => {
  const { user, loading, signIn, signOut, isAuthenticated, getAccessToken } =
    useGoogleAuth();

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - No identity token');
      }

      // Apple에서 받은 데이터
      const {
        identityToken,
        user: appleUserId,
        email,
        fullName,
      } = appleAuthRequestResponse;

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleUserId,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        try {
          console.log('Apple User Info:', {
            appleUserId,
            email,
            fullName,
            identityToken,
          });

          // Apple은 email을 최초 로그인시에만 제공
          // 이후 로그인에서는 identityToken만 제공됨
          if (email) {
            // 최초 로그인 또는 email이 있는 경우
            const verifyResponse = await verifyMutation({ email });
            console.log('Verify Response:', verifyResponse);

            if (verifyResponse.exists) {
              // 기존 유저 로그인
              await appleLoginMutation({
                identityToken,
                email,
              });
            } else {
              // 신규 유저 회원가입
              await appleSignUpMutation({
                identityToken,
                email,
                name: fullName
                  ? `${fullName.givenName || ''} ${
                      fullName.familyName || ''
                    }`.trim()
                  : undefined,
              });
              navigation.navigate('SignUp');
            }
          } else {
            // 재로그인 (email 정보 없음)
            await appleLoginMutation({
              identityToken,
            });
          }
        } catch (error) {
          console.error('Error during Apple social login flow:', error);
          showToast(
            '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
            'error',
          );
        }
      } else {
        console.error('Apple login failed:', credentialState);
        showToast('애플 로그인에 실패했습니다.', 'error');
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.log('User canceled Apple Sign in');
      } else {
        console.error('Apple Sign-In error:', error);
        showToast('애플 로그인 중 오류가 발생했습니다.', 'error');
      }
    }
  };

  const handleSignIn = async (name: ProviderType) => {
    try {
      if (name === 'APPLE') {
        await signInWithApple();
        return;
      }
      await signIn();
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

  const { showToast } = useToast();
  const [loginContext, setLoginContext] = useState<{
    providerType: 'NAVER' | 'KAKAO' | 'GOOGLE' | 'APPLE' | 'NONE';
    authCode: string;
    name: string;
    nickName: string;
    phoneNumber: string;
  }>({
    providerType: 'NONE',
    authCode: '',
    nickName: '',
    name: '',
    phoneNumber: '',
  });
  const { setIsAuthenticated } = useAuth();
  const { setIsGuest, setUser } = useUser();

  const [result, setResult] = useState<string>('');

  const [uniqueNickName, setUniqueNickName] = useState(() =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      length: 3,
      style: 'capital',
    }),
  );

  // APPROVED, REJECTED, WAITING
  const fetchMyInfo = async () => {
    try {
      const response = await customAxios.get(`${API_PREFIX}/users/me`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch my info');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching my info:', error);
      showToast('내 정보 조회에 실패했습니다.', 'error');

      return null;
    }
  };

  // 기존 유저인지 아닌지 검증하는 mutation
  const { mutateAsync: verifyMutation } = useMutation({
    mutationFn: async (context: { email: string }) => {
      const response = await customAxios.get(`${API_PREFIX}/users/verify`, {
        params: {
          email: context.email,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to verify social login');
      }

      return response.data;
    },
  });

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: async ({ user }: { user: GoogleUser }) => {
      if (!loginContext) {
        throw new Error('Login context is required to update user role');
      }

      const response = await customAxios.post(`${API_PREFIX}/auth/google`, {
        email: user.email,
      });

      if (response.status !== 200) {
        throw new Error('Failed to login with social account');
      }

      console.log('Access token:', response.headers['authorization']);

      await login({
        access_token: response.headers['authorization'].replace('Bearer ', ''),
        refresh_token: response.headers['refreshtoken'].replace(
          'RefreshToken ',
          '',
        ),
      });

      return response.data;
    },
    onSuccess: () => {
      console.log('Login successful');
      setIsAuthenticated(true);
    },
    onError: error => {
      console.error('Error during login:', error);
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  const { mutateAsync: signUpMutation } = useMutation({
    mutationFn: async ({ user }: { user: GoogleUser }) => {
      if (!loginContext) {
        throw new Error('Login context is required to update user role');
      }

      const response = await customAxios.post(`${API_PREFIX}/auth/google`, {
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
      });

      if (response.status !== 200) {
        throw new Error('Failed to login with social account');
      }

      console.log('Access token:', response.headers['authorization']);

      await login({
        access_token: response.headers['authorization'].replace('Bearer ', ''),
        refresh_token: response.headers['refreshtoken'].replace(
          'RefreshToken ',
          '',
        ),
      });

      return response.data;
    },
    onSuccess: () => {
      console.log('Login successful');
      // setIsAuthenticated(true);
      // navigation.navigate('RegisterStore', {
      //   screen: 'RegisterStoreStart',
      // });
    },
    onError: error => {
      console.error('Error during login:', error);
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  const { mutateAsync: appleLoginMutation } = useMutation({
    mutationFn: async ({
      identityToken,
      email,
    }: {
      identityToken: string;
      email?: string;
    }) => {
      const response = await customAxios.post(`${API_PREFIX}/auth/apple`, {
        identityToken,
        email,
      });

      if (response.status !== 200) {
        throw new Error('Failed to login with Apple account');
      }

      console.log('Apple Access token:', response.headers['authorization']);

      await login({
        access_token: response.headers['authorization'].replace('Bearer ', ''),
        refresh_token: response.headers['refreshtoken'].replace(
          'RefreshToken ',
          '',
        ),
      });

      return response.data;
    },
    onSuccess: () => {
      console.log('Apple login successful');
      setIsAuthenticated(true);
    },
    onError: error => {
      console.error('Error during Apple login:', error);
      showToast('애플 로그인에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  const { mutateAsync: appleSignUpMutation } = useMutation({
    mutationFn: async ({
      identityToken,
      email,
      name,
    }: {
      identityToken: string;
      email: string;
      name?: string;
    }) => {
      const response = await customAxios.post(`${API_PREFIX}/auth/apple`, {
        identityToken,
        email,
        name,
      });

      if (response.status !== 200) {
        throw new Error('Failed to sign up with Apple account');
      }

      console.log('Apple Access token:', response.headers['authorization']);

      await login({
        access_token: response.headers['authorization'].replace('Bearer ', ''),
        refresh_token: response.headers['refreshtoken'].replace(
          'RefreshToken ',
          '',
        ),
      });

      return response.data;
    },
    onSuccess: () => {
      console.log('Apple sign up successful');
    },
    onError: error => {
      console.error('Error during Apple sign up:', error);
      showToast('애플 회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  const handleLoginButtonClick = async () => {
    try {
      if (!user) {
        throw new Error('Google user information is missing after sign-in.');
      }

      console.log('Google User Info:', user);
      // 2. 서버에 기존 유저인지 검증 요청
      const verifyResponse = await verifyMutation({
        email: user.email,
      });
      console.log('Verify Response:', verifyResponse);
      if (verifyResponse.exists) {
        // 3-1. 기존 유저라면 바로 로그인 처리
        await loginMutation({ user });
      } else {
        await signUpMutation({ user });
        navigation.navigate('SignUp');
      }
    } catch (error) {
      console.error('Error during Google social login flow:', error);
      showToast('로그인 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  };

  const socialLoginButton = (name: ProviderType) => {
    return (
      <View style={styles.socialLoginWrapper}>
        <SocialLoginButton
          name={name}
          onPress={() => {
            handleSignIn(name);
          }}
        />
      </View>
    );
  };

  useEffect(() => {
    console.log('useEffect User info changed:', user);
    if (user) handleLoginButtonClick();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogoTitleIcon />
            </View>
            <View
              style={{
                gap: 20,
                paddingBottom: 76,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 27,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: '#525252',
                  }}
                ></View>
                <Text style={styles.description}>소셜로그인으로 계속하기</Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: '#525252',
                  }}
                ></View>
              </View>
              <View style={styles.socialLoginContainer}>
                {socialLoginButton('GOOGLE')}
                {Platform.OS === 'ios' && socialLoginButton('APPLE')}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1917',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: Platform.select({
      ios: 40,
      android: 20,
    }),
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },
  bottomContainer: {
    paddingTop: 20,
  },
  socialLoginContainer: {
    justifyContent: 'center',
    gap: 12,
    marginBottom: Platform.select({
      ios: 0,
      android: 40,
    }),
  },
  socialLoginWrapper: {
    position: 'relative',
  },
  recentLoginIndicator: {
    position: 'absolute',
    top: -30,
    right: 8,
    zIndex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  button: {
    backgroundColor: '#FEE500',
    borderRadius: 40,
    borderWidth: 1,
    width: 250,
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    textAlign: 'center',
  },
});

export default SignInScreen;
