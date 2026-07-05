# Approved Scenarios — notice-list

출처: harness/specs/notice-list.spec.md
상태: approved & frozen (notice-list.approved.json 의 scenarioHash 대상)

## S1: 공지 생성하기 이동
- Given: `/notice` 목록 화면
- When: "공지 생성하기" 버튼 클릭
- Then: `/notice/create` 로 이동한다

## S2: 분류 탭 활성화
- Given: `/notice` 화면, "전체" 탭 활성
- When: 다른 분류 탭 클릭
- Then: 클릭한 탭이 활성 상태가 된다
