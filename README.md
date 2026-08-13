# Paweather

<p align="center">
  <img src="src/assets/paweather-logo.png" width="220" alt="Paweather 로고" />
</p>

> Paw + Weather — 반려견과 산책하기 전, 날씨부터 주변 편의시설까지 한 번에 확인하는 대한민국 반려견 산책 날씨 서비스

Paweather는 Vue 학습 과제 1~9를 하나의 실제 서비스로 확장한 결과물이다. 단순히 도시별 기온을 보여주는 Weather 예제에서 출발하여, 현재 위치와 장소·주소 검색, 실시간 날씨와 대기질, 반려견별 산책 위험도, 시간대 추천, 가까운 공중화장실과 실제 지도까지 연결하였음.

이 README는 별도의 과제 보고서를 대신한다. 프로젝트의 기획 배경, 기술 선택 이유, 구현 과정에서 마주친 문제와 해결 방법, 컴포넌트 설계 근거, 과제별 발전 과정을 코드 파일과 함께 확인할 수 있도록 작성하였음.

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [서비스 이름과 컨셉](#2-서비스-이름과-컨셉)
3. [아이디어가 바뀐 과정](#3-아이디어가-바뀐-과정)
4. [사용자와 핵심 시나리오](#4-사용자와-핵심-시나리오)
5. [최종 구현 기능](#5-최종-구현-기능)
6. [전체 기술 구조](#6-전체-기술-구조)
7. [컴포넌트를 나눈 기준과 이점](#7-컴포넌트를-나눈-기준과-이점)
8. [상태 관리와 데이터 흐름](#8-상태-관리와-데이터-흐름)
9. [외부 API와 데이터 처리](#9-외부-api와-데이터-처리)
10. [산책 위험도 계산](#10-산책-위험도-계산)
11. [구현 중 어려웠던 점과 해결](#11-구현-중-어려웠던-점과-해결)
12. [라이브러리 사용 효과](#12-라이브러리-사용-효과)
13. [채점 기준별 구현 근거](#13-채점-기준별-구현-근거)
14. [과제 1~9 발전 과정](#14-과제-19-발전-과정)
15. [디렉터리 구조](#15-디렉터리-구조)
16. [설치와 실행](#16-설치와-실행)
17. [품질 검사와 배포 설정](#17-품질-검사와-배포-설정)
18. [현재 한계와 확장 가능성](#18-현재-한계와-확장-가능성)

## 1. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | Paweather |
| 프로젝트 형태 | Vue 3 SPA(Single Page Application) |
| 대상 사용자 | 대한민국에서 반려견을 산책시키는 보호자 |
| 핵심 질문 | “지금 우리 강아지와 산책해도 괜찮을까?” |
| 주요 데이터 | 현재 날씨, 3시간 예보, 대기질, 현재 위치, 행정동, 주변 공중화장실 |
| 개인화 기준 | 반려견 나이(살·개월), 체급, 기온·습도·바람, 강수, AQI |
| 지원 환경 | 데스크톱·태블릿·모바일, 한국어·영어, 섭씨·화씨 |
| 과제 범위 | Weather Mockup부터 UI Library, Refinement, Deployment까지 과제 1~9 |

일반적인 날씨 서비스는 사람에게 필요한 기온과 강수 정보는 제공하지만, 반려견 보호자가 실제로 궁금한 산책 가능 여부까지는 바로 설명하지 않는다. Paweather는 여러 날씨 수치를 다시 읽고 판단해야 하는 부담을 줄이고, 반려견의 조건과 산책 동선을 함께 고려하는 방향으로 컨셉을 확장하였음.

## 2. 서비스 이름과 컨셉

### Paw + Weather = Paweather

`Paw`는 강아지의 발과 산책을, `Weather`는 산책 판단에 필요한 환경 정보를 의미한다. 두 단어가 만나는 지점의 `w`를 겹쳐 `Pa[w]eather`로 이름을 만들었음.

- **Paw**: 반려견, 발바닥, 걷기, 산책
- **Weather**: 기온, 습도, 바람, 비, 대기질
- **Paweather**: 반려견의 관점에서 다시 해석한 산책 날씨

이름만 보고도 반려견과 날씨가 결합된 서비스라는 점이 드러나도록 하였고, 로고·민트색·크림색 카드·발 모양 SVG 아이콘을 같은 시각 언어로 구성하였음.

### 왜 이런 컨셉을 선택하였는가

반려견 산책은 단순히 “비가 오는가”만 확인해서 결정하기 어렵다. 같은 28°C라도 습도와 바람에 따라 체감 부담이 달라지고, 어린 강아지·노령견·체급에 따라서도 보호자가 더 보수적으로 판단할 필요가 있다. 또한 산책 중에는 보호자도 이용할 수 있는 공공 편의시설과 길찾기 정보가 필요하다.

따라서 다음 세 가지를 한 화면에서 연결하는 것을 서비스의 핵심으로 정하였음.

1. **환경 확인**: 날씨·강수·바람·대기질을 함께 확인
2. **반려견별 판단**: 나이와 체급을 반영한 산책 위험도 제공
3. **산책 동선 보조**: 가까운 공중화장실, 거리, 예상 도보 시간, 지도와 길찾기 제공

## 3. 아이디어가 바뀐 과정

### 최초 아이디어: 공공 쓰레기통 찾기

초기에는 산책 중 수거한 배변 봉투를 처리할 장소를 찾기 어렵다는 경험에서 출발하였다. 그래서 현재 위치에서 가까운 공공 쓰레기통을 보여주는 기능을 구상하였음.

그러나 구현 가능성을 조사하는 과정에서 다음 문제가 있었음.

- 전국 단위로 일관되게 사용할 수 있는 공공 쓰레기통 데이터가 부족하였음
- 일부 지자체 데이터만 존재하여 지역별 편차가 컸음
- 좌표·운영 상태·갱신 주기가 일정하지 않았음
- 검색 결과가 적어 “가장 가까운 시설” 기능을 안정적으로 제공하기 어려웠음

데이터가 없는 상태에서 임의 위치를 보여주면 서비스 신뢰도가 더 낮아진다고 판단하여, 쓰레기통 위치 기능을 억지로 유지하지 않았음.

### 전환한 아이디어: 산책 중 공공 편의시설 찾기

대신 지도 장소 검색과 지자체 자료에서 상대적으로 확인하기 쉬운 **공중화장실**을 산책 중 보호자가 참고할 수 있는 공공 편의시설로 선택하였음.

현재 구현은 Kakao Local의 장소 검색 결과와 확인한 지자체 공공데이터를 결합한다. 예를 들어 장소 검색에서 누락되었던 `봉화재 반려견놀이터 화장실`은 울산 동구청 공중화장실 현황을 기준으로 보완하였음.

> 공중화장실 정보는 배변 봉투를 화장실 쓰레기통에 버리도록 안내하기 위한 기능이 아니다. 시설 규정상 가능한 경우에는 봉투에서 배변만 분리하여 변기에 처리하고, 사용한 봉투는 절대 변기에 넣지 않는다. 봉투는 다시 챙겨 가거나 배변 봉투를 버려도 되는 쓰레기통에 올바르게 버려야 한다. 시설별 처리 규정과 운영시간이 다를 수 있으므로 현장 안내를 우선한다.

이 과정에서 “처음 생각한 기능을 끝까지 고집하는 것”보다 “실제 확보할 수 있는 데이터의 품질과 사용자에게 줄 수 있는 신뢰”를 기준으로 서비스 범위를 조정하는 경험을 하였음.

## 4. 사용자와 핵심 시나리오

### 주요 사용자

- 산책 전에 날씨와 대기질을 빠르게 판단하고 싶은 보호자
- 어린 강아지나 노령견을 키워 더 보수적인 안내가 필요한 보호자
- 두 마리 이상의 반려견을 함께 산책시키는 보호자
- 낯선 장소나 검색한 건물 주변에서 산책하려는 사용자
- 산책 동선 주변의 공공 편의시설 위치를 확인하려는 사용자

### 핵심 사용 흐름

```text
반려견 프로필 등록
        ↓
현재 위치 허용 또는 장소·주소 검색
        ↓
정확한 위도·경도를 기준으로 날씨·대기질 조회
        ↓
반려견별 산책 위험도와 현재부터 6시간 뒤까지의 추천 확인
        ↓
가장 가까운 공중화장실의 거리·도보 시간·지도 확인
        ↓
필요하면 카카오맵 도보 길찾기로 이동
```

장소를 검색한 경우 화면 상단에는 이해하기 쉬운 **행정동까지만** 표시하지만, 날씨·대기질·공중화장실 계산에는 사용자가 선택한 **건물 또는 주소의 정확한 좌표**를 유지한다. 표시용 지역명과 계산용 좌표를 분리하여 검색 의도가 사라지지 않도록 하였음.

## 5. 최종 구현 기능

### 위치와 검색

- 브라우저 Geolocation의 `watchPosition()`으로 현재 위치를 추적
- Kakao 좌표→행정구역 변환으로 시·구·동 표시
- 대한민국 17개 시·도 선택 제공
- 건물명, 도로명, 지번주소, 동네 검색 지원
- Kakao 키워드 검색과 주소 검색을 병렬 호출
- 주소형 검색어는 주소 결과를 먼저 보여주고 중복 결과 제거
- 현재 위치 권한을 거부해도 장소·주소 검색 사용 가능

### 날씨와 대기질

- 현재 기온, OpenWeather 체감온도, 습도, 강수확률, 풍속 표시
- AQI, PM2.5, PM10 표시
- 현재부터 6시간 뒤까지의 산책 시간 카드 제공
- 3시간 예보를 1시간 간격 예상값으로 선형 보간
- 이미 지나간 시간은 제외하고 가로 스크롤 제공

### 반려견 맞춤 산책 지수

- 여러 마리의 반려견 프로필 저장
- 나이를 `살` 또는 `개월`로 입력
- 소형견·중형견·대형견 선택
- 각 강아지의 환경 체감온도와 산책 위험도를 별도로 표시
- 어린 강아지·노령견·체급별 온도 취약성을 위험 단계에 반영
- 여러 마리가 함께 산책할 때 시간대 카드는 가장 높은 위험도를 기준으로 표시
- 상태에 따라 권장 산책 시간과 한 줄 보호자 팁 제공

### 주변 공중화장실

- 현재 위치 또는 검색한 정확한 좌표 기준 3km 이내 검색
- `공중화장실`, `공공화장실`, `화장실` 검색 결과 병합
- Kakao Local 검색 결과와 확인한 지자체 데이터를 하나의 후보 목록으로 합쳐 거리순 정렬
- 거리, 방위, 예상 도보 시간, 주소, 데이터 출처 표시
- Leaflet + OpenStreetMap으로 출발지와 도착지 표시
- 카카오맵 도보 길찾기 및 장소 정보 연결

### 사용자 편의성과 완성도

- 한국어·영어 전환
- 섭씨·화씨 전환
- 반려견 프로필·언어·단위를 localStorage에 저장
- 로딩·오류·빈 결과·위치 권한 거부·오프라인 상태 안내
- 데스크톱·태블릿·모바일 반응형 레이아웃
- 키보드 포커스와 reduced motion 접근성 대응
- 공통 SVG 아이콘으로 이모티콘 스타일 통일

## 6. 전체 기술 구조

### 사용 기술

| 구분 | 기술 | 선택 이유와 적용 효과 |
| --- | --- | --- |
| Framework | Vue 3 | Composition API로 비동기 상태와 파생값을 기능 단위로 구성하였음 |
| Build | Vite | 빠른 개발 서버, `import.meta.env`, 프록시, 정적 빌드를 사용하였음 |
| Routing | Vue Router | 홈·상세·소개·후원·과제·404를 URL 단위로 분리하였음 |
| State | Pinia | 언어·단위·저장된 반려견처럼 여러 화면이 공유하는 상태를 분리하였음 |
| Utility | VueUse | localStorage, 온라인 상태, reduced motion 감지를 간결하게 구현하였음 |
| HTTP | Axios | API 요청과 오류 처리를 서비스 파일로 분리하고 병렬 요청을 구성하였음 |
| UI Library | Element Plus | 폼 검증, 자동완성, Drawer, Alert, Skeleton, Empty, Message를 적용하였음 |
| Map | Leaflet | 지도 인스턴스와 마커를 Vue 생명주기에 맞추어 직접 제어하였음 |
| Map data | OpenStreetMap | 출발지와 도착지의 실제 주변 지도를 표시하였음 |
| Quality | ESLint | JavaScript와 Vue 문법을 제출 전에 자동 검사하였음 |
| Deployment config | Vercel | SPA fallback, Kakao 프록시, 캐시와 보안 헤더를 설정하였음 |

### 애플리케이션 구조

```text
App.vue
├─ 과제 이동 Drawer
└─ RouterView
    ├─ WeatherHomeView
    │  └─ WeatherParent                # 상태·API·도메인 계산 조합
    │     ├─ PaweatherHeader           # 내비게이션·언어·단위
    │     ├─ DogProfileForm            # 입력·검증·저장 이벤트
    │     ├─ BaseDashboardCard         # slot 기반 공통 외곽
    │     │  └─ SearchBar              # 장소·주소 자동완성
    │     ├─ CurrentLocationDashboard  # 날씨·대기질·시간·화장실
    │     │  └─ RestroomLocationMap    # Leaflet 인스턴스 관리
    │     ├─ WalkIndexPanel            # 등록한 모든 강아지 결과
    │     ├─ ServiceSummarySection     # 기능 설명·상황별 팁
    │     └─ PaweatherFooter
    ├─ WeatherDetailView
    ├─ WeatherAboutView
    ├─ DonationView
    ├─ Assignment01~09View
    └─ NotFoundView

WeatherParent
├─ configStore / profileStore
├─ weatherApi.js
├─ kakaoLocalApi.js
└─ locationEnglish.js
```

화면 컴포넌트가 Axios를 직접 호출하지 않도록 `services`를 두었고, 컴포넌트가 모두 localStorage를 직접 다루지 않도록 `stores`를 두었다. 외부 데이터 형식이 변경되어도 서비스 정규화 코드만 수정하고, 저장 방식이 변경되어도 Store를 중심으로 수정하도록 책임을 나누었음.

## 7. 컴포넌트를 나눈 기준과 이점

처음에는 한 파일에서 많은 화면과 계산을 함께 관리하였으나, 기능이 늘면서 지도 수정이 날씨 화면에 영향을 주거나 모바일 CSS가 다른 영역과 충돌하는 문제가 생겼다. 이에 **데이터 소유**, **화면 역할**, **외부 라이브러리 생명주기**를 기준으로 컴포넌트를 분리하였음.

| 컴포넌트 | 책임 | 분리한 이유와 이점 |
| --- | --- | --- |
| `WeatherParent.vue` | API 상태, 활성 위치, 산책 계산, 전체 조합 | 데이터의 단일 출처를 유지하여 현재 위치와 검색 위치의 모순을 줄였음 |
| `PaweatherHeader.vue` | 브랜드, 내비게이션, 언어·단위 | 헤더 반응형 수정이 본문 레이아웃과 섞이지 않게 하였음 |
| `UnitToggler.vue` | 섭씨·화씨 전환 | 메인과 상세 페이지가 같은 Store 기준을 사용하게 하였음 |
| `DogProfileForm.vue` | 이름·나이·체급 입력과 검증 | 입력 UI와 산책 계산을 분리하여 검증 규칙을 독립적으로 수정하게 하였음 |
| `SearchBar.vue` | 시·도 선택, 자동완성, 검색 이벤트 | Kakao 결과 표시와 입력 상태를 분리하여 검색 UI 변경 범위를 줄였음 |
| `BaseDashboardCard.vue` | 공통 카드 외곽과 slot | 같은 카드 외형 안에 다른 내용을 주입하여 마크업 중복을 줄였음 |
| `CurrentLocationDashboard.vue` | 날씨·대기질·시간대·화장실 표시 | 하나의 위치를 기준으로 묶여야 하는 정보를 같은 영역에서 관리하였음 |
| `RestroomLocationMap.vue` | Leaflet 생성·갱신·삭제 | 지도 인스턴스와 `ResizeObserver` 정리를 부모 계산과 분리하였음 |
| `WalkIndexPanel.vue` | 모든 강아지의 산책 결과 | 한 마리만 보이던 문제를 해결하고 배열 기반 출력으로 확장하였음 |
| `ServiceSummarySection.vue` | 서비스 설명과 한 줄 팁 | 상황별 팁의 마크업과 스타일을 메인 계산에서 분리하였음 |
| `PaIcon.vue` | 공통 SVG 아이콘 | 운영체제마다 다르게 보이는 이모티콘을 하나의 선 스타일로 통일하였음 |
| `WeatherCard.vue` | props·emit 기반 날씨 카드 | 과제 3에서 학습한 Props Down / Events Up 구조를 보존하였음 |

### Props Down / Events Up을 유지한 이유

`DogProfileForm`과 `SearchBar`는 부모가 값을 props로 전달하고, 사용자의 입력과 저장 동작을 emit으로 올린다. 자식이 부모의 API 상태나 산책 계산을 직접 수정하지 않으므로 데이터 흐름을 추적하기 쉬워졌음.

```text
WeatherParent
  ↓ props: 입력값·라벨·검색 결과
DogProfileForm / SearchBar
  ↑ emit: 값 변경·저장·검색·초기화
WeatherParent
```

새 입력 필드가 추가되면 Form과 프로필 모델을 중심으로 수정할 수 있고, 검색 API가 변경되면 SearchBar의 화면 구조를 유지한 채 service와 부모 로딩 로직만 교체할 수 있도록 구성하였음.

## 8. 상태 관리와 데이터 흐름

### 로컬 상태와 전역 상태의 구분

모든 값을 Pinia에 넣지 않았다. 한 컴포넌트 안에서만 사용하는 검색 로딩, 위치 오류, 폼 입력 중 값은 `ref`와 `reactive`로 관리하였다. 여러 컴포넌트와 Router 페이지에서 공유해야 하는 값만 Pinia Store로 분리하였음.

| 상태 | 관리 위치 | 이유 |
| --- | --- | --- |
| 검색어·후보·API 로딩·현재 위치 | `WeatherParent.vue`의 `ref` | 메인 화면의 비동기 흐름에 종속된 상태 |
| 프로필 입력 중 값 | `reactive` + `DogProfileForm` | 저장 전 임시 상태이며 부모·자식 관계가 명확함 |
| 언어·온도 단위 | `configStore` | 헤더, 메인, 상세 등 여러 화면에서 공유함 |
| 저장된 반려견 목록 | `profileStore` | 대시보드와 PAWALK INDEX가 동시에 사용함 |

### Pinia + VueUse

`useLocalStorage()`를 Pinia setup store에 연결하여 새로고침 뒤에도 다음 값이 유지되도록 하였음.

```text
configStore
├─ paweather-temperature-unit
└─ paweather-language

profileStore
└─ paweather-dog-profiles
```

컴포넌트는 저장 매체가 localStorage인지 알 필요 없이 Store만 사용한다. 이후 저장 방식을 서버 계정 기반으로 바꾸더라도 화면 컴포넌트의 변경 범위를 줄일 수 있는 구조임.

### 파생 상태에 computed를 사용한 이유

현재 위치와 검색 위치 중 어떤 데이터를 보여줄지, 선택한 단위로 몇 도를 표시할지, 각 강아지의 위험도가 무엇인지 같은 값은 원본 데이터에서 계산되는 값이다. 이를 별도 state로 복사하지 않고 `computed`로 구성하여 원본 변경 시 자동으로 일치하도록 하였음.

대표 파생값:

- `activeDashboardLocation`: 현재 위치 또는 검색 위치 선택
- `activeDashboardWeather`: 활성 위치의 날씨 선택
- `activeDashboardRestroom`: 활성 위치의 화장실 선택
- `savedDogWalkList`: 등록한 모든 강아지의 산책 결과 생성
- `walkTimeSlots`: 현재부터 6시간 뒤까지 시간 카드 생성

## 9. 외부 API와 데이터 처리

### OpenWeather

| API | 사용 데이터 |
| --- | --- |
| Current Weather | 기온, 체감온도, 습도, 풍속, 날씨 상태 |
| 5 Day / 3 Hour Forecast | 강수확률과 앞으로의 예보 |
| Air Pollution | AQI, PM2.5, PM10, O3, NO2 |

`weatherApi.js`에서 외부 응답을 화면이 공통으로 사용할 객체 형식으로 정규화하였다. 화면은 OpenWeather의 원본 필드 구조를 알 필요가 없고 `temp`, `humidity`, `rain`, `wind`, `status`, `hourlyForecast` 같은 프로젝트 기준 필드만 사용함.

현재 날씨·예보 요청과 대기질 요청은 서로 기다릴 필요가 없으므로 `Promise.all()`로 병렬 호출하여 대기 시간을 줄였음.

### Kakao Local

| 기능 | 사용 목적 |
| --- | --- |
| 키워드 검색 | 건물명·장소명 검색 |
| 주소 검색 | 도로명·지번주소 검색 |
| 좌표→행정구역 | 정확한 좌표를 시·구·동으로 표시 |
| 주변 장소 검색 | 가까운 공중화장실 후보 조회 |

장소 검색과 주소 검색 결과는 구조가 다르므로 `normalizePlaceResult()`와 `normalizeAddressResult()`로 같은 형식으로 바꾸었다. 주소 문자열 또는 좌표를 키로 중복을 제거하고, 숫자가 포함되거나 `로·길·동` 형태인 검색어는 주소 결과를 먼저 배치하였음.

### Geolocation

GPS는 정지 상태에서도 좌표가 조금씩 달라질 수 있다. 위치가 바뀔 때마다 모든 API를 다시 호출하면 할당량과 네트워크 사용량이 불필요하게 증가한다. 그래서 다음 방식으로 나누었음.

- 화장실까지의 표시 거리: GPS 갱신 때마다 즉시 다시 계산
- 날씨·대기질·행정동·화장실 API: 최초 조회 또는 약 500m 이상 이동 시 재호출
- 위치 Watch 종료: 컴포넌트 unmount 시 `clearWatch()` 실행

### Leaflet + OpenStreetMap

지도는 Vue 템플릿만으로 갱신할 수 없는 외부 인스턴스이므로 `RestroomLocationMap.vue`가 생성과 제거를 전담한다.

- 좌표 변경 시 기존 마커와 선을 제거하고 다시 그림
- 출발지와 화장실을 `circleMarker`로 구분
- 두 좌표가 모두 보이도록 `fitBounds()` 적용
- 컨테이너 크기 변화에 `ResizeObserver`로 대응
- 컴포넌트 종료 시 지도와 Observer 제거
- 점선은 실제 보행 경로가 아니라 직선 방향임을 화면에 명시

## 10. 산책 위험도 계산

### 1단계: 환경 체감온도

날씨 API의 수치를 그대로 강아지 체감온도라고 부르지 않고, 기온·습도·바람으로 계산한 값을 **환경 체감온도**로 표시한다.

- 추운 환경: 기온 10°C 이하이고 바람이 1.34m/s 이상이면 wind chill 계산
- 더운 환경: 기온 27°C 이상이고 습도 40% 이상이면 heat index 계산
- 그 외 환경: 실제 기온 사용

### 2단계: 기본 환경 위험도

| 단계 | 주요 기준 |
| --- | --- |
| 위험 | 뇌우·폭우, 환경 체감온도 34°C 이상 또는 -10°C 이하, 풍속 12m/s 이상, AQI 5 |
| 주의 | 환경 체감온도 30°C 이상 또는 0°C 이하, 풍속 8m/s 이상, AQI 4 |
| 가벼운 산책 | 일반 비, 환경 체감온도 26°C 이상 또는 7°C 이하, 습도 80% 이상, AQI 3 |
| 안전 | 위 조건에 해당하지 않는 비교적 부담이 낮은 환경 |

### 3단계: 나이·체급 취약성 반영

나이와 체급 때문에 온도를 임의로 더하거나 빼지 않았다. 대신 더위·추위 부담 구간에서 취약 조건이 있으면 위험 단계를 한 단계 높였음.

- 1살 미만: 어린 강아지 기준
- 대형견 7살 이상: 노령 기준
- 중형견 9살 이상: 노령 기준
- 소형견 11살 이상: 노령 기준
- 환경 체감온도 24°C 이상인 대형견: 더위 부담 반영
- 환경 체감온도 10°C 이하인 소형견: 추위 부담 반영

여러 마리를 등록한 경우 각 강아지 결과를 모두 보여주고, 시간대 추천에는 가장 높은 위험도를 적용하였다. 현재 카드가 위험인데 같은 시간대 카드가 가능으로 표시되던 모순을 같은 `getWalkLevel()` 함수로 해결하였음.

> 이 산책 지수는 일반적인 환경 정보를 정리한 참고 안내이며 수의학적 진단이 아니다. 품종, 털, 건강 상태, 체력, 직사광선, 지면 온도는 보호자가 추가로 확인해야 한다.

## 11. 구현 중 어려웠던 점과 해결

| 문제 | 원인 | 해결 | 개선된 점 |
| --- | --- | --- | --- |
| 동 이름만 검색되었음 | 날씨 지역 검색만으로 건물·주소 표현이 부족하였음 | Kakao 키워드 검색과 주소 검색을 병렬 연결하였음 | 건물명·도로명·지번·동네 검색이 가능해졌음 |
| 검색한 건물이 행정동으로 바뀌었음 | 표시용 역지오코딩 결과가 원래 좌표까지 덮었음 | 표시 이름과 계산 좌표를 분리하였음 | 화면에는 동을 보여주면서 화장실은 정확한 건물 기준으로 찾게 되었음 |
| 공공 쓰레기통 데이터가 부족하였음 | 전국 단위 좌표 데이터와 갱신 품질이 부족하였음 | 공중화장실이라는 공공 편의시설로 범위를 전환하였음 | 실제 검색 가능한 위치 기반 기능을 제공하게 되었음 |
| 알고 있는 화장실이 검색되지 않았음 | Kakao 장소 카테고리에 일부 공식 시설이 누락되었음 | 확인한 지자체 공공데이터를 후보 목록에 보완하였음 | 봉화재 반려견놀이터 화장실이 거리 비교에 포함되었음 |
| 약도가 실제 위치를 알기 어려웠음 | 처음에는 임의 선과 장식 지도만 사용하였음 | Leaflet과 OpenStreetMap 실제 지도로 교체하였음 | 주변 도로와 출발지·도착지 관계를 확인하게 되었음 |
| 지도가 카드 밖으로 넘쳤음 | Leaflet 캔버스와 Grid 자식의 최소 너비가 충돌하였음 | `min-width: 0`, `overflow: hidden`, ResizeObserver를 적용하였음 | 데스크톱과 모바일에서 카드 안에 지도가 유지되었음 |
| 화장실 이름이 두 줄로 내려갔음 | 텍스트 영역의 너비와 줄바꿈 제어가 없었음 | 말줄임·고정 배지·반응형 너비를 조정하였음 | 이름과 지도 영역이 안정적으로 정렬되었음 |
| 도보 시간이 없었음 | Kakao 장소 거리는 직선거리만 제공하였음 | 직선거리 × 1.25 우회 계수와 75m/분 보행속도로 예상값을 계산하였음 | 사용자가 거리 숫자를 시간으로 이해하기 쉬워졌음 |
| 3시간 간격 예보가 너무 성겼음 | 무료 Forecast 원본 간격이 3시간이었음 | 현재값과 예보 사이를 선형 보간하여 1시간 예상값을 생성하였음 | 지금부터 6시간 뒤까지 비교할 수 있게 되었음 |
| 여러 강아지 중 한 마리만 보였음 | primaryDog만 화면에 전달하였음 | `savedDogs.map()`으로 강아지별 결과 배열을 생성하였음 | 모든 강아지의 위험도를 동시에 비교하게 되었음 |
| 1살 미만 입력이 불편하였음 | 나이 단위가 살로 고정되어 있었음 | 살·개월 segmented 입력과 원래 단위 저장을 추가하였음 | 1~11개월 강아지를 자연스럽게 등록하게 되었음 |
| 섭씨·화씨가 일부 화면에만 적용되었음 | 변환 로직이 컴포넌트별로 흩어졌음 | configStore의 단위와 공통 변환 기준을 사용하였음 | 메인·예보·산책 지수·상세가 함께 변경되었음 |
| 영어 화면에 한국어가 남았음 | API 고유명사와 UI 문구를 같은 방식으로 처리하였음 | UI 사전과 `locationEnglish.js` 보조 표기를 분리하였음 | 고유명사는 원문을 유지하면서 영문 안내를 함께 제공하였음 |
| 기본 이모티콘 스타일이 제각각이었음 | 운영체제별 컬러 이모지가 다르게 렌더링되었음 | `PaIcon.vue` 공통 SVG 아이콘으로 교체하였음 | 크기·색상·선 굵기가 일관된 화면이 되었음 |
| 저장 전부터 폼이 오류처럼 보였음 | 입력 초기 상태와 검증 오류 상태가 구분되지 않았음 | Element Plus Form 검증을 제출·변경 시점에 연결하였음 | 빈 입력은 중립적으로 보이고 저장 시 정확한 오류를 안내하게 되었음 |
| 오프라인에서도 API 요청이 발생하였음 | 네트워크 상태를 확인하지 않았음 | VueUse `useOnline()`으로 새 요청을 차단하였음 | 기존 정보는 유지하고 새 검색만 제한하게 되었음 |

### 도보 시간의 한계

현재 도보 시간은 실제 보행 경로 API 결과가 아니다. Kakao Local 직선거리에 도로 우회분 25%를 더하고 일반 보행속도 75m/분을 적용한 예상값이다. 10분 이하는 올림, 그보다 긴 시간은 5분 단위로 올림 처리하였다. 실제 이동은 카카오맵 도보 길찾기 버튼으로 확인하도록 구분하였음.

## 12. 라이브러리 사용 효과

### Element Plus

Element Plus를 단순히 설치하는 데 그치지 않고 반복 동작이 많고 접근성이 필요한 영역에 선택적으로 적용하였다.

| 컴포넌트 | 적용 위치 | 효과 |
| --- | --- | --- |
| `ElForm`, `ElFormItem` | 반려견 프로필 | 필수값·길이·나이 범위 검증을 규칙으로 관리하였음 |
| `ElInput`, `ElInputNumber` | 이름·나이 | 글자 수, 정수 입력, clear 동작을 일관되게 제공하였음 |
| `ElSegmented`, `ElSelect` | 살·개월·체급·시도 | 선택 상태와 키보드 조작을 공통 처리하였음 |
| `ElAutocomplete` | 장소·주소 검색 | 비동기 검색 후보와 사용자 선택을 연결하였음 |
| `ElAlert`, `ElSkeleton`, `ElEmpty` | 오류·로딩·빈 상태 | 정상 데이터 외 상태도 명확하게 표현하였음 |
| `ElMessage`, `ElMessageBox` | 저장·초기화 | 결과 피드백과 파괴적 동작 확인을 추가하였음 |
| `ElDrawer` | 과제 메뉴 | 작은 화면에서도 과제 1~9 이동을 유지하였음 |
| `ElTable` | 과제 기록 | 적용 기술과 결과를 읽기 쉬운 표로 정리하였음 |

Element Plus의 기본 디자인을 그대로 사용하지 않고 CSS 변수 `--el-color-primary`, 테두리, 모서리, 글꼴을 Paweather 디자인에 맞추었다. 서비스 고유성이 강한 날씨·산책·지도 카드는 직접 만든 컴포넌트를 유지하였음.

### VueUse

- `useLocalStorage()`: 프로필·언어·단위 저장
- `useOnline()`: 오프라인 상태 감지와 API 요청 차단
- `usePreferredReducedMotion()`: 사용자 동작 줄이기 환경 반영

직접 이벤트 리스너와 localStorage 직렬화 코드를 반복 작성하지 않아 코드가 짧아졌고, 브라우저 상태를 Vue 반응형 값처럼 사용하게 되었음.

### Pinia

페이지마다 온도 단위와 언어를 전달하는 긴 props 체인을 줄였다. 상세 페이지와 메인 화면이 같은 설정을 읽기 때문에 한 화면만 화씨로 바뀌는 불일치도 줄였음.

### Axios

요청 설정과 응답 처리를 `services`에 모아 컴포넌트의 역할을 화면 상태 관리로 제한하였다. `try / catch / finally`로 로딩과 오류를 구분하고, 독립 요청은 `Promise.all()`로 병렬 실행하였음.

## 13. 채점 기준별 구현 근거

| 채점 항목 | 구현 근거 | 확인 파일 |
| --- | --- | --- |
| Vue 기본 문법 | `v-if`, `v-for`, `:class`, props, emit, 이벤트 수식어, slot을 실제 화면에 적용하였음 | [`WeatherParent.vue`](src/components/paweather/WeatherParent.vue), [`WeatherCard.vue`](src/components/paweather/WeatherCard.vue) |
| Composition API | `ref`, `reactive`, `computed`, `watch`, `onMounted`, `onUnmounted`로 검색·위치·프로필·시간 상태를 구성하였음 | [`WeatherParent.vue`](src/components/paweather/WeatherParent.vue), [`CurrentLocationDashboard.vue`](src/components/paweather/CurrentLocationDashboard.vue) |
| 확장 정도 | 정적 날씨 예제를 실제 API, GPS, 다중 반려견, 위험도, 지도, 다국어 서비스로 확장하였음 | [`weatherApi.js`](src/services/weatherApi.js), [`kakaoLocalApi.js`](src/services/kakaoLocalApi.js) |
| 컴포넌트 | 화면 역할과 외부 인스턴스 책임을 기준으로 컴포넌트를 분리하였음 | [`src/components/paweather`](src/components/paweather) |
| 상태 관리 | Pinia와 VueUse로 공유 상태와 브라우저 저장을 구현하였음 | [`configStore.js`](src/stores/configStore.js), [`profileStore.js`](src/stores/profileStore.js) |
| Router | Lazy Loading, 상세 동적 경로, 소개·후원·과제·404 라우트를 구성하였음 | [`router/index.js`](src/router/index.js), [`App.vue`](src/App.vue) |
| API / Axios | OpenWeather와 Kakao Local 요청을 서비스 계층으로 분리하고 응답을 정규화하였음 | [`src/services`](src/services) |
| UI Library | Element Plus 폼·자동완성·상태 UI·Drawer를 목적에 맞게 적용하였음 | [`DogProfileForm.vue`](src/components/paweather/DogProfileForm.vue), [`SearchBar.vue`](src/components/paweather/SearchBar.vue) |
| 완성도 | 반응형, 한국어·영어, 섭씨·화씨, 오류·빈 상태, 접근성, 설정 보존을 반영하였음 | [`main.css`](src/assets/main.css), [`PaIcon.vue`](src/components/paweather/PaIcon.vue) |
| 품질·배포 | ESLint, 환경변수 제외, production build, Vercel SPA·proxy 설정을 완료하였음 | [`eslint.config.js`](eslint.config.js), [`.env.example`](.env.example), [`vercel.json`](vercel.json) |

## 14. 과제 1~9 발전 과정

각 과제는 별도 결과 페이지로 남겼고 오른쪽 위 메뉴에서 순서대로 확인할 수 있다.

| 과제 | 주제 | 프로젝트에 적용한 내용 | 기록 페이지 |
| --- | --- | --- | --- |
| 1 | Weather Mockup | 배열 반복, 조건부 렌더링, 속성 바인딩, 클릭·입력 이벤트를 적용하였음 | `/assignments/1` |
| 2 | Weather Composition | 반응형 상태, 검색 computed, watcher를 실제 검색과 산책 계산으로 확장하였음 | `/assignments/2` |
| 3 | Weather Component | Props Down / Events Up, slot, 역할별 컴포넌트 분리를 적용하였음 | `/assignments/3` |
| 4 | Weather Router | 홈·상세·소개·후원·과제·404 라우트와 Lazy Loading을 구성하였음 | `/assignments/4` |
| 5 | Weather Store | Pinia로 온도 단위·언어·반려견 프로필을 공유하였음 | `/assignments/5` |
| 6 | Weather Axios API | 실제 장소·날씨·대기질·행정동·화장실 API를 연결하였음 | `/assignments/6` |
| 7 | Weather UI Library | Element Plus로 입력·검증·자동완성·상태 피드백을 체계화하였음 | `/assignments/7` |
| 8 | Weather Refinement | VueUse, 설정 보존, 오프라인, 접근성, 아이콘과 구조를 개선하였음 | `/assignments/8` |
| 9 | Weather Deployment | ESLint, 환경변수, 프로덕션 빌드와 Vercel 설정을 정리하였음 | `/assignments/9` |

## 15. 디렉터리 구조

```text
src/
├─ assets/
│  ├─ main.css                       # 전역 토큰·접근성·Element Plus 테마
│  ├─ paweather-logo.png
│  └─ dog-walk-*.png                 # 산책 단계 이미지
├─ components/paweather/
│  ├─ WeatherParent.vue              # 메인 상태·계산·API 흐름 조합
│  ├─ PaweatherHeader.vue
│  ├─ UnitToggler.vue
│  ├─ DogProfileForm.vue
│  ├─ BaseDashboardCard.vue
│  ├─ SearchBar.vue
│  ├─ CurrentLocationDashboard.vue
│  ├─ RestroomLocationMap.vue
│  ├─ WalkIndexPanel.vue
│  ├─ ServiceSummarySection.vue
│  ├─ PaweatherFooter.vue
│  ├─ PaIcon.vue
│  └─ WeatherCard.vue                # 과제 3 props·emit 학습 컴포넌트
├─ services/
│  ├─ weatherApi.js                  # OpenWeather 요청·정규화
│  └─ kakaoLocalApi.js               # 장소·주소·행정동·화장실
├─ stores/
│  ├─ configStore.js                 # 언어·온도 단위
│  └─ profileStore.js                # 저장된 반려견 목록
├─ utils/
│  └─ locationEnglish.js             # 한국 고유명사 영문 보조 표기
├─ views/
│  ├─ WeatherHomeView.vue
│  ├─ WeatherDetailView.vue
│  ├─ WeatherAboutView.vue
│  ├─ DonationView.vue
│  ├─ NotFoundView.vue
│  └─ assignments/Assignment01~09View.vue
├─ router/index.js
├─ App.vue
└─ main.js

eslint.config.js                     # Vue·JavaScript 품질 검사
.env.example                         # API 환경변수 이름 예시
.gitignore                           # 실제 키·빌드·캐시 제외
.prettierignore                      # Vue CSS 한 줄 형식 보호
vite.config.js                       # 개발·preview Kakao proxy
vercel.json                          # Vercel build·rewrite·header
```

## 16. 설치와 실행

### 요구 환경

- Node.js 20.19 이상
- npm
- OpenWeather API Key
- Kakao Developers REST API Key

### 설치

```bash
npm install
cp .env.example .env
```

`.env`에 실제 키를 입력한다.

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

개발 서버를 실행한다.

```bash
npm run dev
```

현재 위치 기능을 확인하려면 브라우저의 위치 권한을 허용한다. `.env` 값을 변경한 경우 개발 서버를 다시 실행한다.

### 환경변수 보안

- 실제 값이 있는 `.env`와 `.env.*`는 `.gitignore`에서 제외하였음
- 저장소에는 변수 이름만 있는 `.env.example`만 포함하였음
- GitHub push 전에 `.env`가 추적되지 않는 것을 확인하였음

> `VITE_` 환경변수는 브라우저 번들에 포함되므로 완전한 비밀 값이 아니다. 현재 분리는 키가 Git 저장소에 직접 업로드되는 것을 방지한다. 운영 환경에서는 API 제공자의 도메인·쿼터 제한을 함께 적용하고, 완전한 비밀 키는 서버 또는 서버리스 함수에서 관리하는 구조가 필요하다.

## 17. 품질 검사와 배포 설정

### npm 명령

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run lint` | Vue·JavaScript 검사, 경고도 실패 처리 |
| `npm run lint:fix` | 자동 수정 가능한 ESLint 항목 정리 |
| `npm run build` | `dist/` 프로덕션 정적 파일 생성 |
| `npm run preview` | 생성된 `dist/` 로컬 확인 |
| `npm run check` | lint 통과 후 production build 연속 실행 |

### 최종 로컬 검증 결과

- `git diff --check` 통과
- ESLint 오류·경고 0개 확인
- Vite production build 성공
- 정적 preview에서 `/`와 `/assignments/9` HTTP 200 응답 확인
- 과제 1~9 라우트 연결 확인
- `.env` Git 미추적 확인
- Vue SFC의 `<style>` 규칙을 선택자별 한 줄 형식으로 확인

빌드 시 큰 이미지와 Element Plus 번들로 인한 chunk size 경고는 남아 있지만 빌드 오류는 발생하지 않았음.

### Vercel 설정

`vercel.json`에 다음 내용을 반영하였음.

- Vite build command와 `dist/` output directory
- Vue Router 직접 접속과 새로고침을 위한 `index.html` fallback
- `/kakao-local-api/*` 요청을 Kakao Local API로 전달하는 rewrite
- 해시 정적 에셋 장기 캐시
- `X-Content-Type-Options`, `Referrer-Policy` 헤더

현재 저장소에는 Vercel 배포 설정까지 반영하였고 공개 URL은 연결하지 않았음. 공개 배포 시 Vercel 프로젝트 환경변수에 다음 두 키 이름을 등록하는 구조임.

```text
VITE_OPENWEATHER_API_KEY
VITE_KAKAO_REST_API_KEY
```

## 18. 현재 한계와 확장 가능성

### 현재 한계

- 산책 지수는 수의학적 진단이 아니라 일반 환경 참고 정보임
- 품종, 털 길이, 질환, 체력, 직사광선, 지면 온도는 입력값에 포함되지 않음
- 1시간 예보는 OpenWeather 3시간 데이터를 보간한 예상값임
- 공중화장실의 실제 개방 여부와 운영시간은 현장에서 달라질 수 있음
- 지도 점선은 직선 방향이며 실제 보행 경로가 아님
- 도보 시간은 직선거리 기반 예상값임
- 임의의 한국 고유명사를 모두 정확히 번역하는 전문 번역 API는 사용하지 않음
- `VITE_` API Key는 클라이언트 번들에서 확인 가능함
- 공개 배포 URL은 연결하지 않았음

### 확장 가능 항목

- 서버리스 프록시를 통한 API Key 보호
- 실제 보행 경로 API를 이용한 거리·시간 계산
- 전국 단위 공중화장실 운영시간·개방 상태 데이터 결합
- 품종·털·질환·지면 온도를 포함한 프로필 확장
- 수의학 전문가 검토를 거친 위험 기준 고도화
- 전문 번역 또는 다국어 리소스 파일 분리
- 이미지 WebP/AVIF 변환과 라이브러리 chunk 분리
- PWA 또는 Capacitor 기반 모바일 앱 패키징

## 마무리

Paweather는 교재의 Weather 예제를 그대로 반복하지 않고, 실제 반려견 산책에서 느낀 불편을 문제로 정의한 뒤 데이터의 현실적인 한계에 맞추어 기능을 조정한 프로젝트이다. Vue 기본 문법에서 시작하여 Composition API, 컴포넌트, Router, Pinia, Axios, UI Library, Refinement, Deployment 설정까지 단계적으로 연결하였음.

구현 과정에서 화면을 크게 만드는 것보다 **정확한 좌표를 유지하는 것**, 기능을 많이 넣는 것보다 **같은 판단 기준을 여러 화면에서 공유하는 것**, 처음 아이디어를 고집하는 것보다 **실제로 신뢰할 수 있는 데이터를 선택하는 것**이 더 중요하다는 점을 확인하였음.
