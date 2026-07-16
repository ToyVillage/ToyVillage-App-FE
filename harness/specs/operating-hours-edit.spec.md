---
feature: operating-hours-edit
figma:
  fileKey: fkbMQaiPeIufKzjXXoWAPS
  nodeId: 2456:5047
requires_functional_test: true
paths: src/pages/notices/guide, src/features/edit-operating-hours, src/entities/operating-hours
---

# 날짜별 영업시간 수정 행동명세

## 상태와 근거

- Status: Active
- Last refreshed: 2026-07-17
- Figma: `2456:5047`
- 기준 viewport: 1920×1080

## 목적

관리자가 휴관일 관리 캘린더의 날짜를 선택해 해당 날짜의 영업 시작·종료 시간을 확인하고 수정한다.

## 라우트와 진입

- 캘린더 날짜 클릭 → `/notices/guide/hours/:date`
- `date`는 로컬 date-only 형식 `YYYY-MM-DD`다.
- `뒤로가기` 또는 저장 성공 → `/notices/guide`
- 유효하지 않은 날짜 경로는 `/notices/guide`로 이동한다.

## 기본 상태

- 저장된 값이 없는 날짜는 영업 시작 `오전 07:40`, 영업 종료 `오후 07:40`을 기본값으로 사용한다.
- 저장된 값이 있는 날짜는 저장값을 우선 표시한다.
- 제목은 선택 날짜를 기준으로 `M월 D일 영업시간` 형식으로 표시한다.

## 화면 구조

- 본문 x=300px, width=1320px
- 뒤로가기 y=76px
- 제목 y=144px, 60px SemiBold
- 영업 시작·종료 카드 y=248px, width=426px, height=184px
- 카드 padding 40px, radius 20px, 카드 간격 21px
- 시간 입력 높이 68px, 배경 `#F5F5F7`, radius 8px
- 시·분 값 32px Medium, 오전·오후 18px Medium
- `저장하기` 버튼 x=1497px, y=464px, 123×61px

## 시간 입력

- `영업 시작 시`, `영업 시작 분`, `영업 종료 시`, `영업 종료 분`을 숫자로 편집할 수 있다.
- 시는 1–12, 분은 0–59 범위다.
- 오전·오후는 각 카드 안에서 하나만 선택한다.
- 한 자리 값은 포커스를 잃을 때 두 자리로 정규화한다.
- 종료 시간은 시작 시간보다 늦어야 한다.

## 저장

- 유효한 값으로 `저장하기` 클릭 → 선택 날짜의 영업시간을 한 번 저장하고 목록으로 이동한다.
- 다시 같은 날짜를 열면 저장값이 보인다.
- 저장 중에는 중복 제출을 막는다.
- 저장 실패 시 현재 값과 페이지를 유지한다.

## 데이터 경계

백엔드 계약 전에는 localStorage 목업 어댑터를 사용한다.

```ts
interface OperatingHours {
  date: string
  opensAt: string
  closesAt: string
}
```

- `opensAt`, `closesAt`: 24시간제 `HH:mm`
- 서버 상태는 TanStack Query가 소유한다.

## 접근성

- 캘린더 날짜는 실제 링크다.
- 시·분 입력에는 보이는 카드 label에서 파생된 접근 가능한 이름이 있다.
- 오전·오후 선택은 `aria-pressed`로 상태를 전달한다.
- 포커스 표시와 키보드 입력을 지원한다.

## 수용 시나리오

- S1: 캘린더 날짜 클릭 → 해당 날짜 영업시간 화면으로 이동한다.
- S2: 저장값이 없는 날짜 → 오전 07:40, 오후 07:40 기본값이 보인다.
- S3: 시간과 오전·오후를 수정하고 저장 → 목록으로 이동한다.
- S4: 같은 날짜를 다시 열기 → 저장한 값이 보인다.
- S5: 뒤로가기 → 변경 저장 없이 목록으로 이동한다.
- S6: 잘못된 시·분 또는 시작 이후가 아닌 종료 시간 → 저장하지 않고 오류를 표시한다.
- S7: 저장 실패 → 현재 입력과 페이지를 유지하고 재시도할 수 있다.

## 범위 제외

- 요일별 반복 영업시간
- 휴게시간과 다중 영업 구간
- 공휴일 자동 적용
- 실제 API 계약

