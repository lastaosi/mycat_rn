# MyCat RN 🐱

> **KMP로 개발한 MyCat 앱을 React Native로 포팅한 프로젝트**  
> Android 16년 경력 개발자의 React Native 학습 포트폴리오

<br>

## 📱 소개

MyCat은 고양이 건강 관리 앱이에요.  
[KMP 버전(lastaosi/mycat)](https://github.com/lastaosi/mycat)을 React Native + Expo로 포팅하여,  
동일한 앱을 **KMP**와 **React Native** 두 가지 방식으로 구현한 포트폴리오예요.

<br>

## 🛠 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Language | TypeScript |
| Navigation | Expo Router (파일 기반 라우팅) |
| Database | expo-sqlite |
| Chart | victory-native |
| Map | react-native-maps |
| Native Module | Expo Modules API (Kotlin + Swift) |

<br>

## 📂 프로젝트 구조

```
MyCat_React/
├── app/                    # 라우트 진입점 (Expo Router)
│   ├── _layout.tsx         # Stack 네비게이션 설정
│   ├── index.tsx           # Splash 화면
│   ├── main.tsx            # 메인 화면
│   ├── weight.tsx          # 체중 관리
│   ├── vaccination.tsx     # 예방접종
│   ├── medication.tsx      # 투약
│   ├── diary.tsx           # 다이어리
│   ├── healthcheck.tsx     # 건강 체크
│   ├── nearbyvet.tsx       # 근처 동물병원
│   └── deviceinfo.tsx      # 디바이스 정보 (네이티브 모듈)
│
├── src/
│   ├── screens/            # 화면 컴포넌트 (비즈니스 로직 포함)
│   ├── components/         # 재사용 컴포넌트
│   ├── hooks/              # 커스텀 훅 (ViewModel 역할)
│   ├── database/           # Repository (DB 접근 레이어)
│   └── styles/             # 공통 스타일, 컬러
│
└── modules/
    └── device-info-module/ # Expo Modules API 네이티브 모듈
        ├── android/        # Kotlin 구현
        ├── ios/            # Swift 구현
        └── src/            # TypeScript 인터페이스
```

<br>

## 🏗 아키텍처

KMP 클린 아키텍처 경험을 React Native에 적용했어요.

```
Screen (UI)
    ↓
Custom Hook (ViewModel 역할)
    ↓
Repository (DB 접근)
    ↓
expo-sqlite
```

### KMP vs React Native 비교

| KMP | React Native |
|---|---|
| ViewModel | Custom Hook |
| StateFlow | useState |
| LaunchedEffect | useEffect |
| Repository | Repository (동일 패턴) |
| SQLDelight | expo-sqlite |
| expect/actual | Expo Modules API |

<br>

## ✨ 주요 기능

### 고양이 프로필 관리
- 고양이 등록 (이름, 생년월, 성별, 중성화 여부)
- 대표 고양이 설정
- 고양이 추가/삭제

### 체중 관리
- 체중 기록 추가/삭제
- **victory-native** 차트로 체중 추이 시각화
- 내 고양이 추이 / 품종 평균 성장 탭 구성

### 예방접종 관리
- 접종 기록 관리
- 다음 접종일 D-day 계산 및 색상 표시 (임박: 주황, 지남: 빨강)

### 투약 관리
- 투약 기록 관리
- 진행 중 / 완료 자동 분류
- 남은 투약 일수 계산

### 다이어리
- 일기 작성 및 사진 첨부
- expo-image-picker 갤러리 연동

### 건강 체크
- 카테고리별 체크리스트
- 진행률 표시

### 근처 동물병원
- react-native-maps 지도 연동
- 현재 위치 기반 동물병원 마커 표시
- 길찾기 연동 (iOS Maps, Android 지도)

### 네이티브 모듈 (Expo Modules API)
- Kotlin(Android) + Swift(iOS)로 네이티브 구현
- TypeScript 공통 인터페이스로 호출
- 디바이스 정보 조회 (기기명, OS 버전, 앱 버전 등)

<br>

## 🔑 핵심 구현 포인트

### 1. 커스텀 훅 패턴
```typescript
// ViewModel과 동일한 역할
export function useWeight(catId: number) {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeightHistory(catId);
      setRecords(data);
    } catch (e) {
      setError('데이터를 불러올 수 없어요');
    } finally {
      setIsLoading(false);
    }
  }, [catId]);

  return { records, isLoading, error, addWeight, removeWeight };
}
```

### 2. Repository 패턴 + toDomain
```typescript
type WeightRecordRow = {
  id: number;
  catId: number;
  weightG: number;
  recordedAt: number;
  memo: string | null;
};

function toDomain(row: WeightRecordRow): WeightRecord {
  return { ...row };
}
```

### 3. Expo Modules API 네이티브 모듈
```kotlin
// Android (Kotlin)
class Device_infoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Device_info")
    AsyncFunction("getDeviceInfo") {
      mapOf("deviceName" to Build.MODEL, ...)
    }
  }
}
```

```swift
// iOS (Swift)
public class Device_infoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Device_info")
    AsyncFunction("getDeviceInfo") { () -> [String: Any] in
      return ["deviceName": UIDevice.current.name, ...]
    }
  }
}
```

```typescript
// TypeScript — 동일한 인터페이스로 호출
const info = await DeviceInfoModule.getDeviceInfo();
```

<br>

## 🚀 실행 방법

```bash
# 의존성 설치
npm install --legacy-peer-deps

# 개발 서버 실행
npx expo start

# iOS 빌드 (네이티브 모듈 포함)
npx expo run:ios

# Android 빌드 (네이티브 모듈 포함)
npx expo run:android
```

> **참고**: 네이티브 모듈(device-info-module)은 Expo Go에서 동작하지 않아요.  
> `expo run:ios` 또는 `expo run:android`로 개발 빌드를 생성해야 해요.

<br>

## 🔗 관련 프로젝트

- **KMP 버전**: [lastaosi/mycat](https://github.com/lastaosi/mycat)  
  Kotlin Multiplatform + Jetpack Compose (Android) + SwiftUI (iOS)

<br>



KMP, React Native 학습 및 포트폴리오 프로젝트
