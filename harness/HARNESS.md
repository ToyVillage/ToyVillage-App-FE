# Figma-to-Code Publishing Harness — 종합 문서

> 이 문서는 하네스의 **기능·구조·흐름·집행 메커니즘**을 한 곳에 정리한 개요서다.
> 실행 지침(단계별 런북)은 [`RUNBOOK.md`](./RUNBOOK.md), 코드 규칙은 [`design-rules.md`](./design-rules.md) 참조.

---

## 1. 개요

### 한 줄 정의
개발자가 **행동명세(자연어) + Figma 프레임**을 주면, 어떤 AI 에이전트(Claude Code / Codex)든 **동일한 런북**을 따라 FSD-lite Emotion/React/TS 코드로 퍼블리싱하고, **승인 게이트 + 검증 루프 + 가드레일**로 안전하게 마무리하는 파이프라인.

### 핵심 철학
| 원칙 | 의미 |
|------|------|
| **결정적은 스크립트, 판단은 프롬프트** | 셀 수 있는 것(토큰 diff, verify, 루프 카운트, 게이트)은 node 스크립트. 취향/판단(시나리오, 컴포넌트 경계, 코드 수정)은 프롬프트+규칙. |
| **agent-agnostic** | 에이전트 전용 도구 이름을 런북/프롬프트에 쓰지 않음. Claude·Codex 모두 같은 파일·스크립트를 사용. |
| **승인 게이트는 퍼블리싱/e2e 진입 조건** | `gate-check`가 시나리오 승인을 확인해 AI 자기채점을 막는다. (커밋은 막지 않음 — 커밋 판단은 개발자) |
| **기존 우선(Existing wins)** | 저장소 토큰·컴포넌트·ESLint 경계가 Figma 출력보다 우선. |
| **상태는 프로세스 죽음을 견딘다** | 교차 턴 상태(승인·루프)는 전부 파일. |

---

## 2. 3계층 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  ③ 오케스트레이션 (문서화된 런북)                              │
│     harness/RUNBOOK.md — 7단계 흐름, 어떤 에이전트든 동일 실행 │
├─────────────────────────────────────────────────────────────┤
│  ② 판단 (프롬프트 + 규칙)                                      │
│     prompts/{draft-scenarios,publish,fix-code}.md            │
│     design-rules.md · design-input-contract.md · no-progress.md│
├─────────────────────────────────────────────────────────────┤
│  ① 결정적 (node 스크립트)                                      │
│     scripts/*.mjs · playwright.config                        │
└─────────────────────────────────────────────────────────────┘
```

- 하네스는 "큰 커스텀 앱"이 아니라 **파일 + 스크립트 + 훅의 조합**이다. 그래서 Codex도 그대로 쓸 수 있다.

---

## 3. 디렉토리 구조

```
harness/
  HARNESS.md                 ← (이 문서) 종합 개요
  RUNBOOK.md                 오케스트레이션: 7단계 흐름 + 입력경로 + 단계별 호출
  design-rules.md            코드 계약: FSD(=eslint.config.js) + Emotion/TanStack/Zustand/Axios/Router/TS/경계
  design-input-contract.md   Figma 도구 계약 + 스파이크 결과 + 토큰 전략 + MCP-down fallback
  no-progress.md             무진전 감지 조건(프로젝트별 정의) + N=3
  specs/
    <feature>.spec.md        [개발자 입력] 행동명세 + requires_functional_test + paths
    README.md
  templates/                 채워 쓰는 양식(형식만 제공)
    behavioral-spec.md · figma-review.md · scenario-draft.md · component-map.md
  prompts/                   판단 단계 지시서(agent-agnostic)
    draft-scenarios.md · publish.md · fix-code.md
  approvals/                 ★ durable 승인 기록 (Git 커밋 → clone/CI 재현)
    <feature>.approved.json      승인 sentinel (해시 포함)
    <feature>.scenario-draft.md  승인·동결된 시나리오
  artifacts/                 per-run 임시 산출물 (.gitignore)
    <feature>.figma.txt          get_figma_data 저장 덤프 (map-tokens 입력)
    <feature>.token-candidates.json / .token-diff.report.md
    loop-state.json              루프 상태

scripts/
  map-tokens.mjs · verify.mjs · gate-check.mjs · loop-guard.mjs
  run-scenarios.mjs · approve.mjs
playwright.config.ts         baseURL + webServer(yarn dev)
tests/e2e/<feature>.spec.ts  승인 시나리오 → 동결 회귀 스펙 (Git 커밋)
```

> **approvals(커밋) vs artifacts(무시)** 구분이 핵심이다: 승인 기록은 durable(재현 필요), 토큰 덤프·루프 상태는 per-run 임시.

---

## 4. 전체 흐름 (7단계)

```
[입력] 개발자: harness/specs/<feature>.spec.md 작성
       (행동명세 + requires_functional_test + paths + Figma fileKey/nodeId)
        │
        ▼
 ┌─ ① 추출  ‖  시나리오 초안 (병렬) ──────────────────────────────┐
 │  · get_figma_data → artifacts/<feature>.figma.txt 저장         │
 │  · map-tokens.mjs → 토큰 후보 + 기존 tokens.ts diff(읽기전용)   │
 │  · (functional) draft-scenarios.md → 시나리오 초안             │
 └───────────────────────────────────────────────────────────────┘
        │
        ▼
   ② 🚦 개발자 중간 확인 게이트 (퍼블리싱 전 1회)
      · frame/node · 토큰 명명 · component-map · 과분리 · TODO · 시나리오 승인
      · approve.mjs → approvals/<feature>.approved.json (scenarioHash)
        │  (승인 = 동결. 이후 재도출 금지)
        ▼
   ③ 퍼블리싱 (AI)   ── gate-check 먼저(없으면 STOP)
      · 행동명세가 source of truth (Figma만으로 판단 X)
      · design-rules 준수(Emotion 토큰/TanStack/Zustand/Axios/Router/FSD 경계)
        │
        ▼
   ④ 자동검증 (인너 루프)  verify.mjs = yarn verify(lint→typecheck→build)
      · 실패 → fix-code.md로 "코드" 수정 → loop-guard 기록 → 재실행
        │
        ▼
   ⑤ 기능 테스트 (조건부)  requires_functional_test?
      · false → 생략, ⑦로
      · true  → 승인 시나리오 → tests/e2e/<feature>.spec.ts "변환만"
                → approve.mjs --freeze (e2eHash) → run-scenarios.mjs(verify:e2e)
        │  실패 → 코드 수정 후 ④부터
        ▼
   ⑥ 가드레일  loop-guard.mjs: N=3 OR 무진전 → STOP → 개발자 반환
        │
        ▼
   ⑦ 최종 육안 확인 (개발자)  Figma 원본 vs 로컬 비교 (강제 아님, 개발자 판단)
        │
        ▼
   [커밋]  git commit  (개발자가 판단해 커밋 — 훅 강제 없음)
```

### 단계별 집행점(무엇이 확인되나)

| 단계 | 메커니즘 |
|------|--------------|
| ② 승인 | `approve.mjs`가 해시 계산해 sentinel 작성 (손으로 못 위조) |
| ③ 퍼블리싱 | `gate-check.mjs` 통과 필요(sentinel 없으면 exit 3) |
| ④ 검증 | `verify.mjs` exit 0 필요 |
| ⑤ e2e | `run-scenarios.mjs`가 gate-check 먼저 → Playwright |
| ⑥ 루프 | `loop-guard.mjs` STOP(exit 2) 시 중단 |
| ⑦ 육안 | 개발자가 육안 비교 (강제/서명 없음) |

---

## 5. 스크립트 · 명령 레퍼런스

| 스크립트 | yarn 명령 | 역할 | 종료 코드 |
|---------|-----------|------|-----------|
| `map-tokens.mjs` | `yarn harness:map-tokens <f>` | `artifacts/<f>.figma.txt`에서 raw 토큰 수집 → 후보+diff 생성. **tokens.ts 읽기 전용** | 0 성공 / 1 입력 없음 |
| `verify.mjs` | `yarn harness:verify` | `yarn verify`(lint/typecheck/build) 래핑, `{pass,firstError,errorHash}` | 0 pass / 1 fail |
| `gate-check.mjs` | `yarn harness:gate <f>` | 승인 sentinel 유효성 + 내용 해시 검증 | 0 유효 / 3 없음 / 4 무효 |
| `loop-guard.mjs` | `yarn harness:loop <cmd> <f>` | `record`/`reset`/`status`. loop-state 영속, N=3+무진전 판정 | 0 CONTINUE / 2 STOP |
| `approve.mjs` | `yarn harness:approve <f> ...` | 승인 sentinel 작성(scenarioHash) / `--freeze`(e2eHash) | 0 성공 / 1 오류 |
| `run-scenarios.mjs` | `yarn verify:e2e <f>` | gate-check 먼저 → Playwright 실행 | 0 pass / 3·4 게이트 / 1 실패 |
| — | `yarn e2e:setup` | Playwright chromium 설치 | — |

### 승인/동결 명령 예
```bash
node scripts/approve.mjs notice-list --by kimjihwan --scenarios S1,S2   # 승인(scenarioHash)
node scripts/approve.mjs notice-list --freeze                           # e2e 동결(e2eHash)
```

---

## 6. 산출물 vs 승인기록 (durable 분리)

| 경로 | Git | 성격 | 재현 필요? |
|------|-----|------|-----------|
| `harness/approvals/<f>.approved.json` | ✅ 커밋 | 승인 sentinel(해시) | **예** |
| `harness/approvals/<f>.scenario-draft.md` | ✅ 커밋 | 동결 시나리오 | **예** |
| `tests/e2e/<f>.spec.ts` | ✅ 커밋 | 회귀 스펙 | **예** |
| `harness/specs/<f>.spec.md` | ✅ 커밋 | 개발자 입력 | **예** |
| `harness/artifacts/<f>.figma.txt` | ❌ 무시 | Figma 덤프 | 아니오(재추출) |
| `harness/artifacts/<f>.token-*` | ❌ 무시 | 토큰 후보/diff | 아니오(조언용) |
| `harness/artifacts/loop-state.json` | ❌ 무시 | 루프 상태 | 아니오 |

---

## 7. 집행 메커니즘 (3가지 안전장치)

> 승인/검증은 **퍼블리싱·e2e 루프 안에서** 확인된다. **커밋은 막지 않는다** — 커밋 여부는 개발자가 판단한다.

### 7-1. 승인 게이트 (sentinel)
`gate-check.mjs`가 `approvals/<f>.approved.json`을 검사:
- 필수 필드(`feature, approvedAt, approvedBy, scenarioIds`) + `feature` 일치
- `requires_functional_test: true` → `scenarioIds` 비어있지 않음
- 없으면 exit 3, 무효면 exit 4 → 퍼블리싱(③)/e2e(⑤) 진입 **차단**(커밋 아님)

### 7-2. 내용 해시 (승인-사용 불일치 방지)
sentinel의 `scenarioHash`(승인 시나리오)·`e2eHash`(동결 테스트):
- 승인 후 시나리오나 e2e 파일이 바뀌면 gate-check가 **해시 불일치로 STOP** → 재승인 필요
- 승인이 "특정 내용에 대한 서명"이 됨(TOCTOU 차단)

### 7-3. 루프 가드레일 (무한/비용 폭발 방지)
`loop-guard.mjs` + `no-progress.md`:
- STOP 조건: `iteration >= 3` OR `lastErrorHash` 2연속 동일 OR `lastDiffHash` 2연속 동일(에러 지속)
- 사유 우선순위: 정체(no-progress) > 상한(max-iterations)
- STOP 시 개발자 반환. 토큰 방어에도 기여.

---

## 8. 규칙 계약 (판단 계층이 읽는 것)

| 문서 | 내용 |
|------|------|
| `design-rules.md` | FSD import 방향은 **eslint.config.js가 권위**(재서술 X). Emotion 토큰만·TanStack(서버상태, useEffect fetch 금지, Zustand 복제 금지)·Zustand(전역UI/client-only)·Axios 인스턴스·React Router·TS 명시·컴포넌트 경계(COMPONENT=경계/INSTANCE=재사용/variant=props/frame·group·text=경계 아님) |
| `design-input-contract.md` | 실제 Figma 도구(`get_figma_data`/`download_figma_images`). **스파이크 결과: 이 파일은 Variables 미노출** → 토큰은 raw 수집 + 개발자 명명. MCP-down STOP/fallback |
| `no-progress.md` | 무진전 STOP 조건(이 저장소 정의) + N=3 + 리셋 |

---

## 9. 레퍼런스 슬라이스 — `notice-list` (공지사항 목록)

end-to-end 증명용으로 실제 구축된 예:
- **입력**: `harness/specs/notice-list.spec.md` (공지 생성 이동, 분류 탭)
- **코드(FSD-lite)**: `src/entities/notice`(모델+NoticeTable), `src/features/create-notice`(버튼), `src/pages/notice`(NoticeListPage/CreateNoticePage/CategoryTabs)
- **토큰**: 핑크 팔레트(#FF8181 등) 명명해 `tokens.ts` 반영
- **승인**: `approvals/notice-list.approved.json`(S1·S2, scenarioHash+e2eHash)
- **테스트**: `tests/e2e/notice-list.spec.ts` (S1 생성이동 / S2 탭활성) — **2/2 pass**
- 검증됨: 게이트 통과/차단, 해시 변조 감지, 루프가드 N=3·무진전 STOP.

---

## 10. 신규 feature 추가 워크플로 (개발자 관점)

```bash
# 0) (최초 1회) 세팅
yarn install            # 훅 자동 설치
yarn e2e:setup          # Playwright chromium

# 1) 행동명세 작성
cp harness/templates/behavioral-spec.md harness/specs/<feature>.spec.md
#   → 동작, requires_functional_test, paths, Figma fileKey/nodeId 채우기

# 2) 추출 (에이전트가 수행)
#   get_figma_data 결과를 harness/artifacts/<feature>.figma.txt 로 저장
yarn harness:map-tokens <feature>     # 토큰 후보 + diff

# 3) 중간 확인 게이트 → 승인
#   토큰 명명(figma-review), 시나리오를 approvals/<feature>.scenario-draft.md 로
yarn harness:approve <feature> --by <name> --scenarios S1,S2

# 4) 퍼블리싱 (에이전트) → 검증 루프
yarn harness:gate <feature>           # 통과 확인
yarn harness:verify                   # lint/typecheck/build

# 5) 기능 테스트 (functional 인 경우)
#   승인 시나리오 → tests/e2e/<feature>.spec.ts 변환
yarn harness:approve <feature> --freeze
yarn verify:e2e <feature>

# 6) 육안 확인(개발자) 후 커밋 (강제 없음 — 개발자 판단)
git add . && git commit -m "..."
```

---

## 11. 재현 세팅 (신선한 clone / CI)

```bash
yarn install                    # 의존성
yarn e2e:setup                  # 브라우저
yarn verify                     # lint/typecheck/build
yarn verify:e2e notice-list     # 게이트(커밋된 승인) → dev 서버 → 기능 테스트
```
승인 기록이 `harness/approvals/`에 커밋돼 있어 다른 환경에서도 그대로 재현된다.

---

## 12. 설계 결정 요약

| 결정 | 이유 |
|------|------|
| 런북+스크립트 (Node CLI/스킬 아님) | agent-agnostic. Claude 스킬은 Codex가 못 씀. |
| Yarn Berry 4 **node-modules** 링커 | Vite/ESLint/TS/Playwright 반복 실행의 초기 호환성 리스크 축소(PnP 미사용). |
| 토큰 raw 수집 + 개발자 명명 | 스파이크 결과 이 Figma가 Variables 미노출 → 자동 시맨틱 매핑 불가. |
| 시각 비교 수동 | 픽셀 diff는 노이즈·주관적. 목적함수는 "기능 테스트 통과". |
| 시나리오 = AI 초안 + 개발자 승인 | 자기채점 차단(승인 게이트가 고리 끊음). |
| 승인 durable(approvals) + 해시 | clone/CI 재현 + 승인 후 변조 감지. |
| 커밋은 개발자 판단 | 커밋은 사람이 시작하므로(AI 자동 커밋 안 함) 커밋 차단 훅은 중복 마찰 → 제거. 승인/검증은 퍼블리싱·e2e 루프 안에서만. |

---

## 13. 알려진 한계 / 향후

- **Codex 패리티**: 아직 Codex 세션으로 검증 안 됨(설계상 가능). 2번째 프레임으로 확인 예정.
- **육안 확인**: 사람이 눈으로. 강제/서명·커밋 차단 없음(개발자 판단).
- **map-tokens 파싱**: framelink 텍스트 포맷 정규식 기반 → 포맷 변형에 취약할 수 있음.
- **CI 게이트**: 회귀 스위트 CI 자동 실행은 이번 범위 밖(안정화 후 편입 검토).
- **에셋 다운로드**: `download_figma_images` 경로는 슬라이스에서 미검증(아이콘 텍스트 대체).
- **경량화**: 향후 verify를 typecheck+build로 줄이는 옵션(현재 보류).
