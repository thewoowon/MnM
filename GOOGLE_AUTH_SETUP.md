# Google OAuth 설정 가이드

MovieAndMe 앱에서 Google 로그인을 사용하기 위한 설정 가이드입니다.

## 📋 사전 준비

1. **Google Cloud Console 프로젝트 생성**
   - https://console.cloud.google.com/ 방문
   - 새 프로젝트 생성 또는 기존 프로젝트 선택

2. **OAuth 동의 화면 구성**
   - APIs & Services > OAuth consent screen
   - User Type: External 선택
   - 앱 정보 입력 (이름, 이메일 등)
   - Scopes 추가: `openid`, `profile`, `email`
   - 테스트 사용자 추가 (개발 중)

## 🔑 OAuth 클라이언트 ID 생성

### iOS 설정

1. **OAuth 클라이언트 ID 만들기**
   - APIs & Services > Credentials
   - Create Credentials > OAuth client ID
   - Application type: **iOS**
   - Name: MovieAndMe iOS
   - Bundle ID: `org.reactjs.native.example.MovieAndMe` (실제 Bundle ID 확인 필요)

2. **Info.plist 수정**
   
   `ios/MovieAndMe/Info.plist` 파일을 열고 다음 추가:
   
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
       </array>
     </dict>
   </array>
   ```
   
   ⚠️ `YOUR_IOS_CLIENT_ID`를 실제 iOS Client ID로 변경

3. **AppDelegate 수정**
   
   `ios/MovieAndMe/AppDelegate.mm`에 다음 추가:
   
   ```objc
   #import <React/RCTLinkingManager.h>
   
   // 파일 맨 아래에 추가
   - (BOOL)application:(UIApplication *)application
      openURL:(NSURL *)url
      options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
   {
     return [RCTLinkingManager application:application openURL:url options:options];
   }
   ```

### Android 설정

1. **OAuth 클라이언트 ID 만들기**
   - Application type: **Android**
   - Name: MovieAndMe Android
   - Package name: `com.lululala.mnm`
   - SHA-1 인증서 지문 추가

2. **SHA-1 인증서 지문 가져오기**
   
   ```bash
   # Debug 키스토어 (개발용)
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # Release 키스토어 (배포용 - 나중에)
   keytool -list -v -keystore /path/to/your/release.keystore -alias your-alias
   ```

3. **AndroidManifest.xml 수정**
   
   `android/app/src/main/AndroidManifest.xml`에 다음 추가:
   
   ```xml
   <activity
     android:name=".MainActivity"
     android:launchMode="singleTask"
     android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
     
     <!-- 기존 intent-filter 아래에 추가 -->
     <intent-filter>
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:scheme="com.googleusercontent.apps.YOUR_ANDROID_CLIENT_ID" />
     </intent-filter>
   </activity>
   ```
   
   ⚠️ `YOUR_ANDROID_CLIENT_ID`를 실제 Android Client ID로 변경

## 🔧 앱 코드 수정

`App.tsx`의 40-42줄을 실제 Client ID로 변경:

```typescript
GoogleAuthModule.configure({
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // iOS/Android Client ID
  redirectUri: 'com.googleusercontent.apps.YOUR_CLIENT_ID:/oauth2callback',
  scopes: ['openid', 'profile', 'email'],
})
```

**주의사항:**
- iOS와 Android는 각각 다른 Client ID를 사용할 수 있습니다
- `Platform.OS`로 분기해서 다른 Client ID 사용 가능:

```typescript
import { Platform } from 'react-native';

const clientId = Platform.select({
  ios: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  default: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});

GoogleAuthModule.configure({
  clientId: clientId,
  redirectUri: `com.googleusercontent.apps.${clientId.split('.')[0]}:/oauth2callback`,
  scopes: ['openid', 'profile', 'email'],
});
```

## 🚀 실행

### iOS
```bash
cd ios && pod install && cd ..
yarn ios
```

### Android
```bash
yarn android
```

## 🐛 문제 해결

### iOS

**문제**: "No application is registered for the callback scheme"
- **해결**: Info.plist의 CFBundleURLSchemes 확인

**문제**: 브라우저가 앱으로 돌아오지 않음
- **해결**: AppDelegate의 `openURL` 메서드 구현 확인

### Android

**문제**: "Google Sign-In failed with error code 10"
- **해결**: 
  1. SHA-1 지문이 Google Console에 올바르게 등록되었는지 확인
  2. Package name이 일치하는지 확인
  3. `build.gradle`에서 실제 사용 중인 키스토어 확인

**문제**: Intent가 처리되지 않음
- **해결**: AndroidManifest.xml의 intent-filter 확인

### 공통

**문제**: Native module이 인식되지 않음
- **해결**:
  ```bash
  # iOS
  cd ios && pod install && cd ..
  
  # Android는 자동으로 링크됨
  
  # 캐시 클리어
  yarn start --reset-cache
  ```

## 📚 참고 자료

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Google Console](https://console.cloud.google.com/)
- [@openauth/google-rn 문서](../google-rn/README.md)

## ✅ 체크리스트

설정 완료 확인:

- [ ] Google Cloud 프로젝트 생성
- [ ] OAuth 동의 화면 구성
- [ ] iOS OAuth Client ID 생성
- [ ] Android OAuth Client ID 생성  
- [ ] Info.plist에 URL Scheme 추가
- [ ] AppDelegate에 openURL 메서드 추가
- [ ] AndroidManifest.xml에 intent-filter 추가
- [ ] App.tsx의 Client ID 변경
- [ ] iOS Pod 설치
- [ ] 앱 실행 및 로그인 테스트

모든 항목이 완료되면 Google 로그인을 사용할 수 있습니다! 🎉
