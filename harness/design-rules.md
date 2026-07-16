# Design Rules (퍼블리싱 코드 계약)

AI(Claude/Codex)가 컴포넌트를 생성·수정할 때 반드시 지키는 규칙. 퍼블리싱/코드수정 프롬프트가 이 문서를 참조한다.

## 0. FSD 레이어 / import 방향 — ESLint가 권위 (SSOT)

레이어 배치와 import 방향은 **`eslint.config.js`가 기계적으로 강제**한다. 이 문서는 그 규칙을 **재서술하지 않는다**(중복 금지). 규칙의 진실은 `eslint.config.js`이며, `yarn lint`가 통과하면 배치가 맞은 것이다.

- 레이어: `src/{app, pages, features, entities, shared}` (widgets/processes는 확장 시)
- import 방향은 하향식만 허용됨 — 정확한 정의는 `eslint.config.js` 참조. 위반 시 lint가 잡는다.

## 1. 스타일 — Emotion + 의미 토큰 / 구현값 직접 작성

- 스타일은 Emotion(`styled` 또는 `css`)으로 작성한다.
- `tokens.ts`에는 제품 의미가 있는 **solid color**와 공통 **font family**만 둔다. 사용 시 `theme.colors.*`, `theme.font.body`를 쓴다.
- `px`를 포함한 치수, 간격, radius, font-size, breakpoint, z-index, shadow와 `rgba()`/`hsla()` 같은 문맥 색상은 **사용하는 Emotion 스타일에 직접 작성**한다.
- `space`, `radius`, `layout`, `font.size` 토큰을 만들지 않는다. raw 구현값을 재사용한다는 이유만으로 토큰으로 승격하지 않는다.
- solid color는 의미가 재사용될 때 `color.*`로 명명한다. 일회성 색상인지 의미 색상인지 불명확하면 중간 게이트 TODO로 남긴다.
- 인라인 `style={{}}`·임의 CSS 파일 금지.

## 2. 서버 상태 — TanStack Query만

- 서버 데이터 fetching/캐싱은 **TanStack Query**(`useQuery`/`useMutation`)로만 한다.
- 컴포넌트 내부에서 `useEffect` + `fetch`/axios 직접 호출로 서버 데이터를 가져오지 **않는다**.
- **서버 데이터를 Zustand에 복제하지 않는다.** 서버 상태의 소유자는 TanStack Query다.

## 3. 클라이언트 상태 — Zustand (경계 준수)

- **전역 UI 상태 / client-only 상태**에만 Zustand를 쓴다(예: 모달 열림, 사이드바 토글, 폼 임시 입력).
- 서버에서 온 데이터를 Zustand store에 넣지 않는다(규칙 2 참조).

## 4. API 호출 — 공통 Axios 인스턴스

- 모든 HTTP 호출은 `src/shared/api/axios.ts`의 공통 인스턴스를 경유한다(baseURL/interceptor 재사용).
- 컴포넌트/훅에서 `axios`를 새로 만들거나 raw `fetch`를 쓰지 않는다.

## 5. 라우팅 — React Router

- 화면 이동은 React Router(`<Link>`, `useNavigate`)로 한다. `window.location` 직접 조작 금지.

## 6. 타입 — 명시적 TypeScript

- 컴포넌트 props와 API 응답 타입을 명시한다. `any` 지양.
- 이 저장소는 `verbatimModuleSyntax: true` → **타입 전용 import는 `import type`**을 쓴다.

## 6-1. 컴포넌트 내부 구조 (훅 → 함수/핸들러 → return)

컴포넌트 파일은 아래 순서를 지킨다. 이 저장소의 기존 컴포넌트(`ResourceListPage`, `DataTable` 등)가 이미 이 형태다.

1. **imports** — 외부 → 내부(`@/…`) 순.
2. **타입/인터페이스** — 컴포넌트 props 등 (컴포넌트 바로 위).
3. **컴포넌트 본문**(`export function X(props: Props)`), 내부는 이 순서:
   1. **훅 호출** — `useNavigate`, `useState`, `useQuery`, `useStore` 등. 모든 훅은 본문 최상단에 모은다(조건부 호출 금지).
   2. **파생값/메모** — `useMemo`, 계산된 상수 등 훅에서 나온 값을 가공.
   3. **이벤트 핸들러/로컬 함수** — `handleClick` 같은 함수. 간단하면 JSX에 인라인, 재사용·복잡하면 이름 붙인 함수로 훅 아래에 둔다.
   4. **`return` (JSX)** — 마지막. 조기 반환(로딩/에러 가드)이 필요하면 훅 호출 **뒤** return 앞에 둔다.
4. **`styled` 정의·순수 헬퍼 함수** — 컴포넌트 **아래**에 둔다(예: `DataTable`의 `columnWidth`, `const Table = styled.div…`). 컴포넌트 안에서 `styled`를 정의하지 않는다(리렌더마다 재생성 금지).

- 화살표 함수 대신 **named `function` 선언**으로 컴포넌트를 export 한다(기존 관례).
- 한 파일에 컴포넌트 하나가 기본. 얇은 어댑터(§7-1)나 밀접한 하위 요소는 예외.

## 7. 컴포넌트 경계 (Figma 노드 → 코드)

- **Figma `COMPONENT`** → 코드 컴포넌트 경계 후보.
- **Figma `INSTANCE`** → 기존 컴포넌트 사용 위치(재사용, 새 컴포넌트 아님).
- **variant** → props/state 후보.
- **일반 `FRAME`/`GROUP`/`TEXT`/`LINE`/`IMAGE-SVG`** → 컴포넌트 경계로 보지 않는다(레이아웃 컨테이너/요소).
- 대응되는 기존 repo 컴포넌트가 있으면 재사용한다. 과분리 금지.
- Figma가 flat(컴포넌트 미분리)이면 개발자 프롬프트(`harness/specs/<feature>.spec.md`)의 구조/props 명세를 따른다.

## 7-1. 중복 금지 / 공통 컴포넌트 재사용 (DRY)

새 컴포넌트를 만들기 전에 **구조·스타일이 유사한 기존 컴포넌트가 있는지 먼저 확인**한다.

- **구조가 사실상 동일한 컴포넌트를 새로 복제하지 않는다.** (예: `NoticeTable`과 `ResourceTable`, `CreateNoticeButton`과 `CreateResourceButton`처럼 레이아웃·스타일이 같고 데이터/라벨/라우트만 다른 경우)
- 이런 경우 **공통 프레젠테이션을 `src/shared/ui`로 추출**하고, 기존 컴포넌트도 그것을 쓰도록 **수정**한다. 그다음 신규는 같은 shared 컴포넌트를 재사용한다.
  - 예: `shared/ui/DataTable`(분류/제목/날짜 표) — 엔티티는 `도메인 → row` 매핑만 담당(`NoticeTable`/`ResourceTable`은 얇은 어댑터).
  - 예: `shared/ui/LinkButton`(+아이콘 pill 링크) — 기능은 `to`/라벨만 전달.
- shared 컴포넌트는 **도메인 타입에 의존하지 않는다**(entities import 금지). 공통 row/props 형태로 받는다.
- 차이가 정말 본질적일 때만 별도 컴포넌트로 둔다(억지 공통화도 금지).

> ⚠️ 새 shared 컴포넌트 생성이나 기존 shared 컴포넌트 API 변경은 **중간 게이트 승인 대상**이다(무단 금지).

## 8. 검증 게이트 (참고)

- 인너 루프: `yarn verify` = `lint && typecheck && build` (Playwright 아님).
- 기능 테스트: 별도 `verify:e2e`(Playwright). 승인 시나리오 없으면 차단(기능 테스트 필요 작업), 단순 정적은 생략 가능.
