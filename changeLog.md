# Changelog

## [2026-04-30]

### Refactor: 하드코딩 색상값 → colors 토큰 교체

`src/` 폴더 내 모든 `.ts` / `.tsx` 파일의 `StyleSheet.create` 블록에서
하드코딩된 색상 문자열을 `src/styles/common.ts`의 `colors` 객체로 통일했습니다.

#### 교체 규칙

| 기존 값 | 교체 후 |
|---|---|
| `'#FF6B6B'` | `colors.primary` |
| `'#F9F9F9'` | `colors.background` |
| `'#fff'` / `'#ffffff'` | `colors.white` |
| `'#333'` | `colors.text` |
| `'#888'` | `colors.subText` |
| `'#eee'` | `colors.border` |
| `'#FF3B30'` | `colors.error` |
| `'#34C759'` | `colors.success` |
| `'#FF9500'` | `colors.warning` |
| `'#000'` | `colors.cardShadow` |

#### 변경된 파일

| 파일 | import 추가 | 주요 변경 |
|---|---|---|
| `src/components/CatCard.tsx` | - | `shadowColor` |
| `src/components/weight/BreedAverageTab.tsx` | ✓ | `backgroundColor`, `shadowColor`, `color` |
| `src/components/weight/WeightChartTab.tsx` | ✓ | `backgroundColor`, `shadowColor`, `color`, `borderColor` |
| `src/screens/CatDetailScreen.tsx` | - | `color` (buttonText) |
| `src/screens/DeviceInfoScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor` |
| `src/screens/DiaryScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor`, `borderColor` |
| `src/screens/HealthCheckScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor`, `borderColor` |
| `src/screens/MedicationScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor`, `borderColor` |
| `src/screens/NearbyVetScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor` |
| `src/screens/RegisterScreen.tsx` | ✓ | `backgroundColor`, `color`, `borderColor` |
| `src/screens/VaccinationScreen.tsx` | ✓ | `backgroundColor`, `color`, `shadowColor`, `borderColor` |
| `src/screens/WeightScreen.tsx` | ✓ | `backgroundColor`, `color`, `borderColor` |

#### 교체하지 않은 항목 (의도적 제외)

- `StyleSheet.create` 블록 **외부**의 색상값 유지
  - `<ActivityIndicator color="..." />` prop
  - Victory 차트 inline style (`fill`, `stroke`)
  - `getDdayColor()` 함수 반환값 (VaccinationScreen)
  - `<Marker pinColor="..." />` prop
- 매핑 목록에 없는 색상값 유지
  - `#555`, `#666`, `#f0f0f0`, `#ddd`, `#FFF5F5`
  - `#FF6B6B20`, `#34C75920` (알파값 포함 변형색)
