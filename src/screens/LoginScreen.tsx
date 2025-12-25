import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useGoogleLogin } from '@hooks/useGoogleLogin';
import { AuthContext } from '@contexts/AuthContext';
import GoogleIcon from '@components/Icons/SocialIcons/GoogleIcon';

export const LoginScreen = () => {
  const { signInWithGoogle, isLoading } = useGoogleLogin();
  const { setIsAuthenticated, initializeAuth } = useContext(AuthContext)!;
  const [autoLogin, setAutoLogin] = useState(false);

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle(autoLogin);

    if (result.success) {
      // 인증 상태 초기화 (토큰 검증)
      await initializeAuth();
      setIsAuthenticated(true);
    } else {
      Alert.alert('로그인 실패', result.error || '다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MovieAndMe</Text>
        <Text style={styles.subtitle}>영화 취향을 공유하고 추천받아보세요</Text>
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <GoogleIcon width={24} height={24} />
              <Text style={styles.googleButtonText}>Google로 로그인</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.autoLoginCheckbox}
          onPress={() => setAutoLogin(!autoLogin)}
        >
          <View style={[styles.checkbox, autoLogin && styles.checkboxChecked]}>
            {autoLogin && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.autoLoginText}>자동 로그인</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        로그인하면 서비스 이용약관 및{'\n'}
        개인정보 처리방침에 동의하게 됩니다.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    gap: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  autoLoginCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  autoLoginText: {
    fontSize: 14,
    color: '#666',
  },
  terms: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
