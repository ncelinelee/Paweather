# Paweather

Paweather는 대한민국 반려견 보호자를 위한 산책 날씨 서비스입니다. 현재 위치 또는 사용자가 검색한 정확한 장소를 기준으로 날씨, 대기질, 시간대별 산책 추천과 가까운 공중화장실을 한 화면에서 제공합니다.

이 저장소는 Vue 학습 과제 1~9를 하나의 서비스로 발전시킨 최종 결과물입니다.

## 핵심 기능

- 브라우저 GPS를 이용한 현재 행정동과 실시간 날씨 조회
- 대한민국 17개 시·도별 건물명, 도로명, 지번주소, 동네 자동완성 검색
- 선택한 장소의 정확한 좌표를 기준으로 날씨·대기질·공중화장실 조회
- 현재부터 6시간 뒤까지 1시간 간격 산책 가능 시간 제공
- 반려견 여러 마리의 나이 단위(살·개월), 체급별 산책 위험도 비교
- AQI, PM2.5, PM10 및 기온·습도·강수·풍속 표시
- 가장 가까운 공중화장실의 거리, 예상 도보 시간, 실제 지도와 길찾기 제공
- 한국어·영어 및 섭씨·화씨 전환
- 반려견 프로필, 언어와 온도 단위의 브라우저 저장
- 네트워크 연결 끊김, 위치 권한 거부, API 오류와 빈 결과 상태 안내
- 키보드 포커스와 reduced motion을 포함한 접근성 대응

## 기술 스택

| 구분 | 기술 | 사용 목적 |
| --- | --- | --- |
| Framework | Vue 3 | Composition API 기반 화면 구성 |
| Build | Vite | 개발 서버, 환경변수, API 프록시와 프로덕션 빌드 |
| State | Pinia | 언어·단위·반려견 프로필 공유 상태 |
| Utility | VueUse | localStorage, 온라인 상태, reduced motion 감지 |
| Routing | Vue Router | 홈, 상세, 소개, 후원, 과제 기록 페이지 |
| HTTP | Axios | OpenWeather 및 Kakao Local 요청 |
| UI | Element Plus | 폼 검증, 입력, 자동완성, 알림, Drawer와 상태 UI |
| Map | Leaflet + OpenStreetMap | 출발지·화장실 지도와 직선 방향 표시 |
| Quality | ESLint + eslint-plugin-vue | JavaScript·Vue 문법과 제출 오류 검사 |
| Deployment | Vercel | Vite 정적 빌드, SPA 라우팅과 API 프록시 호스팅 |

## 실행 방법

### 요구 환경

- Node.js 20.19 이상
- npm
- OpenWeather API Key
- Kakao Developers REST API Key

### 설치와 실행

```bash
npm install
cp .env.example .env
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소로 접속합니다. 현재 위치 기능을 사용하려면 브라우저의 위치 권한을 허용해야 합니다.

### 프로덕션 빌드

```bash
npm run check
npm run preview
```

### 품질 검사 명령

| 명령 | 설명 |
| --- | --- |
| `npm run lint` | Vue와 JavaScript를 검사하며 경고도 실패로 처리 |
| `npm run lint:fix` | 자동 수정 가능한 ESLint 항목 정리 |
| `npm run build` | `dist/`에 Vite 프로덕션 정적 파일 생성 |
| `npm run check` | ESLint 통과 후 프로덕션 빌드까지 연속 실행 |
| `npm run preview` | 생성된 `dist/`를 로컬 서버에서 확인 |

## 환경변수

프로젝트 루트의 `.env`에 다음 값을 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

Vite 환경변수는 개발 서버 시작 또는 빌드 시 주입되므로 `.env`를 수정한 뒤에는 서버를 다시 실행해야 합니다. 실제 키가 들어 있는 `.env`와 `.env.*`는 `.gitignore`로 제외하고 저장소에는 변수 이름만 있는 `.env.example`만 포함합니다.

> `VITE_` 접두사가 붙은 값은 브라우저 번들에서 사용할 수 있으므로 저장소 노출 방지용 환경변수입니다. 운영용 비밀 키가 필요하다면 별도 서버나 서버리스 함수에서 요청을 중계해야 합니다.

## 사용자 흐름

### 현재 위치

```text
navigator.geolocation.watchPosition()
        ↓
현재 위도·경도
        ├─ Kakao 좌표→행정구역
        ├─ OpenWeather 현재 날씨·예보·대기질
        └─ Kakao Local + 지자체 공공데이터 화장실 비교
                ↓
행정동 · 시간대 추천 · 가장 가까운 화장실 · 지도
```

GPS 미세 이동마다 API를 다시 호출하지 않도록 첫 조회 또는 약 500m 이상 이동한 경우에만 날씨와 장소 데이터를 갱신합니다. 이미 찾은 화장실까지의 표기 거리는 위치 변화에 맞춰 다시 계산합니다.

### 장소·주소 검색

```text
시·도 선택 + 검색어 입력
        ↓
Kakao 키워드 검색 + 주소 검색
        ↓
건물·도로명·지번·동네 후보 선택
        ↓
선택한 정확한 좌표 유지
        ├─ 화면 지역명은 행정동까지만 표시
        └─ 날씨·대기질·화장실은 정확한 출발 좌표 사용
```

## 산책 지수 기준

환경 체감온도는 기온, 습도와 바람을 이용합니다. 반려견의 나이와 체급은 온도를 임의로 더하거나 빼지 않고 더위·추위 구간에서 위험 단계를 보수적으로 조정하는 데 사용합니다.

- 어린 강아지와 체급별 노령 기준 반영
- 소형견의 추위 취약성과 대형견의 더위 취약성 반영
- 강한 강수, 극단적 온도와 나쁜 대기질 반영
- 여러 마리를 등록하면 각 강아지 결과와 시간대별 가장 높은 위험도 표시

산책 지수는 일반적인 환경 정보를 정리한 참고 안내이며 수의학적 진단이 아닙니다. 품종, 털, 건강 상태, 체력, 직사광선과 지면 온도는 보호자가 별도로 확인해야 합니다.

## 디렉터리 구조

```text
src/
├─ assets/                  # 로고, 반려견 이미지, 전역 스타일
├─ components/paweather/
│  ├─ WeatherParent.vue     # 메인 서비스 데이터와 화면 조합
│  ├─ PaweatherHeader.vue   # 내비게이션, 단위와 언어 설정
│  ├─ CurrentLocationDashboard.vue
│  ├─ DogProfileForm.vue
│  ├─ SearchBar.vue
│  ├─ RestroomLocationMap.vue
│  ├─ WalkIndexPanel.vue    # 여러 강아지별 산책 결과
│  ├─ ServiceSummarySection.vue
│  ├─ PaweatherFooter.vue
│  ├─ PaIcon.vue            # 공통 단색 SVG 아이콘
│  └─ ...
├─ services/
│  ├─ weatherApi.js         # OpenWeather 응답 정규화
│  └─ kakaoLocalApi.js      # 장소·주소·행정동·화장실 검색
├─ stores/
│  ├─ configStore.js        # 언어·온도 단위
│  └─ profileStore.js       # 저장된 반려견 프로필
├─ views/
│  ├─ WeatherHomeView.vue
│  ├─ WeatherDetailView.vue
│  ├─ WeatherAboutView.vue
│  ├─ DonationView.vue
│  └─ assignments/          # 과제 1~9 구현 기록
└─ router/index.js
eslint.config.js            # JavaScript·Vue ESLint Flat Config
.env.example                # 값이 없는 환경변수 작성 예시
vercel.json                 # Vite 빌드, SPA fallback, API 프록시 설정
```

## 주요 라우트

| 경로 | 설명 |
| --- | --- |
| `/` | Paweather 메인 대시보드 |
| `/weather/:cityId` | 선택한 위치의 날씨 상세 |
| `/about` | 서비스 소개 |
| `/donate` | 유기견 후원 준비 페이지 |
| `/assignments/1` ~ `/assignments/9` | 과제별 구현 기록 |

라우트 컴포넌트는 동적 import로 불러오며 페이지 이동 시 브라우저 탭 제목도 함께 갱신합니다.

## 외부 데이터

### OpenWeather

- Current Weather: 현재 기온, 체감온도, 습도, 풍속과 날씨 상태
- 5 Day / 3 Hour Forecast: 앞으로의 시간대별 예보
- Air Pollution: AQI, PM2.5와 PM10

3시간 간격 Forecast는 현재부터 6시간 뒤까지 1시간 간격 예상값으로 보간합니다. 화면에도 관측값이 아닌 예상값임을 표시합니다.

### Kakao Local

- 키워드 및 주소 검색
- 좌표를 행정구역으로 변환
- 주변 공중화장실 검색과 장소 정보
- 카카오맵 길찾기 URL 연결

개발 환경에서는 `vite.config.js`의 `/kakao-local-api` 프록시를 사용합니다. 공중화장실은 Kakao Local 결과와 확인된 지자체 공공데이터를 거리순으로 비교하며 실제 개방 여부와 운영시간은 현장에서 달라질 수 있습니다.

### OpenStreetMap

Leaflet 지도 타일로 출발지와 화장실을 표시합니다. 점선은 실제 보행 경로가 아닌 두 좌표 사이의 직선 방향이며, 실제 이동은 카카오맵 도보 길찾기를 사용합니다.

## 과제 발전 과정

1. Weather Mockup: 정적 날씨 화면
2. Weather Composition: Vue 화면 조합
3. Weather Component: props와 emit 기반 컴포넌트 분리
4. Weather Router: 목록과 상세 페이지 라우팅
5. Weather Store: Pinia 언어·온도·프로필 상태
6. Weather Axios API: 실제 장소·날씨·대기질·공중화장실 API
7. Weather UI Library: Element Plus 공통 UI와 폼 검증
8. Weather Refinement: VueUse, 상태 보존, 접근성, 스타일과 README 최종 정리
9. Weather Deployment: ESLint 품질 검사, 환경변수 분리, 프로덕션 빌드와 호스팅 설정

## 배포

`vercel.json`은 Vite 빌드 결과인 `dist/`를 배포하고 다음 동작을 유지하도록 구성되어 있습니다.

- Vue Router 경로 직접 접속과 새로고침을 위한 `index.html` fallback
- `/kakao-local-api/*` 요청을 Kakao Local API로 전달하는 rewrite
- 해시가 포함된 정적 에셋 장기 캐시
- `nosniff`, referrer policy 기본 보안 헤더

Vercel에서 저장소를 Import한 뒤 Project Settings → Environment Variables에 아래 두 변수를 등록하고 배포합니다.

```text
VITE_OPENWEATHER_API_KEY
VITE_KAKAO_REST_API_KEY
```

배포 후에는 `/`, `/about`, `/donate`, `/assignments/9` 직접 접속과 새로고침, 장소 검색, 날씨·대기질, 지도, 길찾기, 모바일 화면을 확인합니다.

## 확인 사항

- 위치 권한을 거부해도 장소·주소 검색은 사용할 수 있습니다.
- 오프라인에서는 마지막으로 표시된 정보는 유지되지만 새 API 검색은 제한됩니다.
- API Key가 없거나 할당량을 초과하면 해당 상태에 맞는 안내가 표시됩니다.
- `npm run check`로 제출 전 ESLint와 프로덕션 빌드를 한 번에 확인할 수 있습니다.
