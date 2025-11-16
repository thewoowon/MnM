import customAxios from '@axios/customAxios';
import {API_PREFIX} from '@env';
import {login} from './auth';

export interface GoogleAuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    profile_pic?: string;
    provider: string;
  };
}

/**
 * Google ID Token을 사용하여 서버에 로그인
 * @param idToken - Google OAuth에서 받은 ID Token
 * @param isAutoLogin - 자동 로그인 선택 여부
 * @returns 사용자 정보
 */
export const loginWithGoogle = async (
  idToken: string,
  isAutoLogin: boolean = false,
): Promise<GoogleAuthResponse> => {
  try {
    const response = await customAxios.post<GoogleAuthResponse>(
      `${API_PREFIX}/auth/google`,
      {
        id_token: idToken,
        is_selected: isAutoLogin,
      },
    );

    // 서버에서 헤더로 반환한 토큰 추출
    const accessToken = response.headers['authorization']?.replace(
      'Bearer ',
      '',
    );
    const refreshToken = response.headers['refreshtoken']?.replace(
      'RefreshToken ',
      '',
    );

    if (!accessToken || !refreshToken) {
      throw new Error('토큰을 받지 못했습니다.');
    }

    // 토큰 저장
    await login({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return response.data;
  } catch (error: any) {
    console.error('Google login failed:', error);
    throw new Error(
      error.response?.data?.message || 'Google 로그인에 실패했습니다.',
    );
  }
};
