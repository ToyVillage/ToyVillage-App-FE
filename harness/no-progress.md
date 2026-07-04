# No-Progress 조건 (이 저장소 정의)

`loop-guard.mjs`가 매 실패 반복마다 `artifacts/loop-state.json`을 갱신하고 아래로 STOP/CONTINUE를 판정한다.

## 상태
`loop-state.json` = `{ feature, iteration, lastErrorHash, lastDiffHash, errorHashStreak, diffHashStreak }`
- `lastErrorHash`: 직전 실패의 첫 에러 지문(verify/e2e 출력 정규화 후 해시).
- `lastDiffHash`: 직전 반복에서 코드 수정 diff의 지문.
- `*Streak`: 값이 연속으로 안 바뀐 횟수.

## STOP 조건 (하나라도 참이면 STOP)
1. **반복 상한:** `iteration >= 3` (N=3).
2. **에러 정체:** `lastErrorHash`가 **2회 연속** 동일 (같은 에러가 안 없어짐).
3. **수정 정체:** `lastDiffHash`가 **2회 연속** 동일 **이면서 에러가 여전히 존재** (예: Prettier가 normalize해 사실상 no-op인 수정 반복).

> 조건 3의 2회 연속 창은 조건 2와 대칭(단발 false-STOP 방지 — Prettier가 무효화한 1회 수정으로 즉시 멈추지 않음).

## 평가 순서 & 사유 우선순위
`loop-guard.mjs`는 매 실패 반복에서 **먼저 streak(조건 2·3)을 평가**하고, 그다음 상한(조건 1)을 본다. streak는 hash 갱신 **후** 평가한다.
- N=3과 "2회 연속"은 iteration 3에서 함께 성립할 수 있다. 이때 STOP 사유는 **정체(no-progress)를 우선** 보고한다(더 정보량이 큼). 정체가 아니면 사유는 `max-iterations`.
- 이 우선순위 덕분에 streak 분기는 사장(dead)되지 않고, "3번 다 썼다"가 아니라 "같은 자리에서 못 나아갔다"를 개발자에게 알린다.

## 리셋
- 새 feature 실행 시 `loop-guard.mjs reset <feature>`로 초기화. `feature` 키가 저장값과 다르면 자동 리셋.
- 성공(verify/e2e 통과) 시 해당 feature 엔트리 제거.

## STOP 시 동작
- 루프 중단, 개발자에게 STOP 사유(`reason`)와 마지막 에러를 반환. 자동 재시도 금지.
