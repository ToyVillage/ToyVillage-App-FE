# Approved Scenarios — resources-list

출처: harness/specs/resources-list.spec.md
상태: approved & frozen (resources-list.approved.json 의 scenarioHash 대상)

## S1: 자료 추가하기 이동
- Given: `/notices/resources` 자료실 목록 화면
- When: "자료 추가하기" 버튼 클릭
- Then: `/notices/resources/create` 로 이동한다

## S2: 파일 유형 탭 필터/활성화
- Given: `/notices/resources` 화면, "전체" 탭 활성
- When: "pdf" 유형 탭 클릭
- Then: 클릭한 탭이 활성 상태가 되고 목록이 pdf 자료로 필터된다

## S3: 자료 행 상세 이동
- Given: `/notices/resources` 화면
- When: 테이블의 자료 행 클릭
- Then: `/notices/resources/:id` 로 이동한다
