declare module '@env' {
  export const API_URL: string;
  export const STORYBOOK_ENABLED: string;
  export const IOS_GOOGLE_CLIENT_ID: string;
  export const IOS_GOOGLE_REDIRECT_URI: string;
  export const ANDROID_GOOGLE_CLIENT_ID: string;
  export const ANDROID_GOOGLE_REDIRECT_URI: string;
  export const API_PREFIX: string;
}

declare module '*.svg' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

type ProviderType = 'KAKAO' | 'NAVER' | 'APPLE' | 'GOOGLE';