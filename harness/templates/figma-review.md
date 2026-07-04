<!-- 퍼블리싱 전 통합 중간 게이트. 개발자가 채우고, 모두 OK면 sentinel(<feature>.approved.json)을 작성해 승인한다. -->

# Figma Review — <feature>

날짜: <YYYY-MM-DD> / 검토자: <name>

## 체크리스트 (모두 확인해야 승인)
- [ ] **Figma frame/node 일치** — 올바른 fileKey/nodeId를 추출했는가
- [ ] **토큰/theme 매핑** — `artifacts/token-diff.report.md`의 raw 후보에 시맨틱 이름을 부여했는가
      - 이 저장소는 Figma Variables가 없어 자동 명명 불가 → 아래 표에 개발자가 이름 지정
- [ ] **component-map** — `artifacts/<feature>.component-map.md`의 노드→컴포넌트 매핑이 맞는가
- [ ] **과분리 여부** — 새 컴포넌트 후보가 과하지 않은가(기존 재사용 우선)
- [ ] **애매 항목 TODO** — 불확실한 값/동작이 TODO로 표시됐는가
- [ ] **시나리오 승인** — `artifacts/<feature>.scenario-draft.md`의 시나리오(핵심~엣지)를 검토·가지치기했는가 (정적 퍼블리싱이면 생략)

## 토큰 명명 (raw → 시맨틱)
| raw 값 | 제안 용도 | 확정 토큰 이름 | 기존 tokens.ts와 |
|--------|-----------|----------------|------------------|
| #FF8181 | 강조(핑크) | color.primary? | (new/conflict) |
| #F5F5F7 | 배경 | color.background? | |
| … | | | |

## 승인 시나리오
승인하는 시나리오 id 목록(동결됨):
- [ ] S1: …
- [ ] S2: …

## 승인 액션
위가 모두 OK면 아래 sentinel을 작성한다(= 승인):

`harness/artifacts/<feature>.approved.json`
```json
{
  "feature": "<feature>",
  "approvedAt": "<ISO-8601>",
  "approvedBy": "<name>",
  "scenarioIds": ["S1", "S2"]
}
```
> 승인 후 시나리오는 동결된다. AI는 이 시나리오만 Playwright로 변환할 수 있고 재도출할 수 없다.
> 정적 퍼블리싱(`requires_functional_test: false`)이면 `scenarioIds: []`로 둔다(게이트 자체는 여전히 필요).
