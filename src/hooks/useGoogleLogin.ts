import { useState } from 'react';
import { loginWithGoogle } from '@screens/auth/auth';
import GoogleAuthModule from '@thewoowon/google-rn';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async (isAutoLogin: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. @thewoowon/google-rn을 사용하여 Google 로그인
      const result = await GoogleAuthModule.signIn();

      if (!result.idToken) {
        throw new Error('Google ID Token을 받지 못했습니다.');
      }

      // 2. 서버에 ID Token 전송 및 자체 토큰 발급
      const userData = await loginWithGoogle(result.idToken, isAutoLogin);

      setIsLoading(false);
      return {
        success: true,
        user: userData.user,
        googleUser: result.user, // Google에서 받은 사용자 정보 (옵션)
      };
    } catch (err: any) {
      const errorMessage =
        err.message || 'Google 로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const signOutFromGoogle = async () => {
    try {
      await GoogleAuthModule.signOut();
    } catch (err) {
      console.error('Google sign out failed:', err);
    }
  };

  return {
    signInWithGoogle,
    signOutFromGoogle,
    isLoading,
    error,
  };
};
