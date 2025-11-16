# Google 로그인 구현 완료 가이드

MovieAndMe 앱의 Google 로그인 기능이 완성되었습니다.

## 📋 구현된 기능

### 1. 서버 측 (MovieAndMe-server)
✅ Google ID Token 검증
✅ JWT Access/Refresh Token 발급
✅ 토큰 재발급 엔드포인트
✅ 로그아웃 기능
✅ RN 앱 호환 에러 코드

### 2. 앱 측 (MovieAndMe)
✅ Google 로그인 서비스 함수
✅ useGoogleLogin 커스텀 훅
✅ LoginScreen 컴포넌트
✅ 자동 로그인 옵션

---

## 🚀 서버 실행 방법

### 1. 서버 디렉토리로 이동
```bash
cd /Users/aepeul/dev/server/MovieAndMe-server
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 값을 설정하세요:

```env
# JWT Settings
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Database
DATABASE_URL=sqlite+aiosqlite:///./app/db/movieandme.db

# API Settings
API_V1_STR=/api/v1
PROJECT_NAME=MovieAndMe API
DEBUG=True
```

### 3. 의존성 설치
```bash
poetry install
# 또는
pip install fastapi uvicorn pydantic-settings sqlalchemy python-decouple alembic aiosqlite requests pyjwt python-multipart python-dotenv
```

### 4. 데이터베이스 초기화
```bash
python -c "from app.db.session import sync_engine; from app.db.base import Base; from app.models import User, Token; Base.metadata.create_all(bind=sync_engine)"
```

### 5. 서버 실행
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

서버가 `http://localhost:8000`에서 실행됩니다.
API 문서: `http://localhost:8000/api/v1/docs`

---

## 📱 RN 앱 설정

### 1. 환경 변수 설정
`.env` 파일에 서버 URL을 추가하세요:

```env
API_URL=http://localhost:8000
API_PREFIX=/api/v1
```

**주의**: Android 에뮬레이터에서는 `http://10.0.2.2:8000` 사용

### 2. Google OAuth 설정
Google Cloud Console에서 OAuth 클라이언트 ID를 생성하세요:
- iOS: Bundle ID 사용
- Android: Package name + SHA-1 인증서 지문

자세한 내용은 [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) 참조

### 3. App.tsx에서 Google 설정
```typescript
import {GoogleAuthModule} from '@thewoowon/google-rn';
import {Platform} from 'react-native';

// App 시작 시
GoogleAuthModule.configure({
  clientId: Platform.select({
    ios: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    android: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  }),
  redirectUri: Platform.select({
    ios: 'com.googleusercontent.apps.YOUR_IOS_CLIENT_ID:/oauth2callback',
    android: 'com.googleusercontent.apps.YOUR_ANDROID_CLIENT_ID:/oauth2callback',
  }),
  scopes: ['openid', 'profile', 'email'],
});
```

---

## 💻 코드 사용법

### LoginScreen 사용
```typescript
// App.tsx 또는 네비게이션 설정
import {LoginScreen} from './src/screens/LoginScreen';
import {AuthContext} from './src/contexts/AuthContext';

function App() {
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <>
      {!isAuthenticated ? (
        <LoginScreen />
      ) : (
        <MainApp />
      )}
    </>
  );
}
```

### 커스텀 로그인 구현
```typescript
import {useGoogleLogin} from '@hooks/useGoogleLogin';

function MyLoginButton() {
  const {signInWithGoogle, isLoading} = useGoogleLogin();

  const handleLogin = async () => {
    const result = await signInWithGoogle(true); // autoLogin: true

    if (result.success) {
      console.log('User:', result.user);
      // 로그인 성공 처리
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
      <Text>Google 로그인</Text>
    </TouchableOpacity>
  );
}
```

### 로그아웃
```typescript
import {logout} from '@services/auth';
import {useGoogleLogin} from '@hooks/useGoogleLogin';

function LogoutButton() {
  const {signOutFromGoogle} = useGoogleLogin();

  const handleLogout = async () => {
    await logout(); // 앱 토큰 삭제
    await signOutFromGoogle(); // Google 로그아웃
    // 로그인 화면으로 이동
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>로그아웃</Text>
    </TouchableOpacity>
  );
}
```

---

## 🔄 인증 플로우

```
1. 사용자가 "Google로 로그인" 버튼 클릭
   ↓
2. @thewoowon/google-rn이 Google OAuth 화면 표시
   ↓
3. 사용자가 Google 계정으로 로그인
   ↓
4. Google ID Token 수신
   ↓
5. 앱이 서버로 ID Token 전송
   POST /api/v1/auth/google
   Body: { "id_token": "...", "is_selected": true }
   ↓
6. 서버가 Google API로 토큰 검증
   ↓
7. 사용자 조회 또는 생성
   ↓
8. 자체 Access Token & Refresh Token 발급
   ↓
9. 헤더로 토큰 반환
   Authorization: Bearer {access_token}
   RefreshToken: RefreshToken {refresh_token}
   ↓
10. 앱이 토큰 저장 (EncryptedStorage)
   ↓
11. AuthContext의 isAuthenticated = true
   ↓
12. 메인 화면으로 이동
```

---

## 🔐 토큰 관리

### Access Token
- **만료 시간**: 30분
- **용도**: API 요청 시 Authorization 헤더에 포함
- **저장 위치**: EncryptedStorage

### Refresh Token
- **만료 시간**: 7일
- **용도**: Access Token 만료 시 재발급
- **저장 위치**: EncryptedStorage + 서버 DB

### 자동 갱신
`customAxios.ts`의 인터셉터가 자동으로 처리:
1. API 요청 시 Access Token 첨부
2. 401 에러 + `JWT_VERIFY_EXPIRED` 코드 수신
3. Refresh Token으로 자동 재발급
4. 원래 요청 재시도

---

## 🐛 문제 해결

### 서버 연결 안 됨
- 서버가 실행 중인지 확인
- Android 에뮬레이터: `http://10.0.2.2:8000` 사용
- iOS 시뮬레이터: `http://localhost:8000` 사용
- 실제 기기: 컴퓨터의 IP 주소 사용

### Google 로그인 실패
- Google Cloud Console에서 OAuth 클라이언트 설정 확인
- Bundle ID / Package Name 일치 여부 확인
- SHA-1 인증서 지문 등록 여부 확인 (Android)
- Info.plist URL Scheme 설정 확인 (iOS)

### 토큰 만료 에러
- Refresh Token도 만료된 경우 재로그인 필요
- `JWT_VALIDATE_ERROR` 발생 시 자동으로 로그인 화면 이동

---

## 📂 파일 구조

```
MovieAndMe/
├── src/
│   ├── services/
│   │   └── auth/
│   │       ├── auth.ts           # 기본 인증 함수
│   │       ├── token.ts          # 토큰 저장/조회
│   │       ├── google.ts         # ✨ Google 로그인
│   │       └── index.ts          # Export
│   ├── hooks/
│   │   └── useGoogleLogin.ts     # ✨ Google 로그인 훅
│   ├── screens/
│   │   └── LoginScreen.tsx       # ✨ 로그인 화면
│   ├── contexts/
│   │   └── AuthContext.tsx       # 인증 상태 관리
│   └── axios/
│       └── customAxios.ts        # 토큰 자동 관리

MovieAndMe-server/
├── app/
│   ├── api/v1/endpoints/
│   │   ├── auth.py               # ✨ Google 로그인 API
│   │   └── user.py
│   ├── services/
│   │   └── auth_service.py       # ✨ Google 인증 로직
│   └── main.py
```

---

## ✅ 테스트 체크리스트

- [ ] 서버가 정상적으로 실행됨
- [ ] Google 로그인 버튼 클릭 시 Google 화면 표시
- [ ] 로그인 성공 시 메인 화면 이동
- [ ] 앱 재시작 시 로그인 상태 유지 (자동 로그인)
- [ ] 토큰 만료 시 자동 재발급
- [ ] 로그아웃 정상 작동
- [ ] API 요청 시 토큰 자동 첨부

---

## 🎉 완료!

Google 로그인 기능이 완전히 구현되었습니다.
이제 서버를 실행하고 앱에서 테스트해보세요!

문제가 발생하면 서버 로그와 앱 콘솔을 확인하세요.
