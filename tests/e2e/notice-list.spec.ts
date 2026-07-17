import { test, expect } from '@playwright/test'

// 승인된 시나리오(notice-list.approved.json: S1~S6)를 변환한 것.
// AI는 이 파일을 재도출하지 않는다(동결). 실패 시 코드를 수정한다.

test('S1: "공지 생성하기" 클릭 → /notices/list/create 이동', async ({
  page,
}) => {
  await page.goto('/notices/list')
  await page.getByRole('link', { name: '공지 생성하기' }).click()
  await expect(page).toHaveURL(/\/notices\/list\/create$/)
})

test('S2: 분류 탭 클릭 → 활성화', async ({ page }) => {
  await page.goto('/notices/list')
  const tab = page.getByRole('button', { name: '팀이름 1' })
  await tab.click()
  await expect(tab).toHaveAttribute('aria-pressed', 'true')
})

test('S3: 제목 검색 → 목록 필터', async ({ page }) => {
  await page.goto('/notices/list')
  await page.getByRole('searchbox', { name: '공지 검색' }).fill('주차장')
  await expect(page.getByTestId('notice-row')).toHaveCount(1)
  await expect(page.getByTestId('notice-row').first()).toContainText(
    '주차장 이용 변경 공지',
  )
})

test('S4: 검색 결과 없음 → 빈 상태', async ({ page }) => {
  await page.goto('/notices/list')
  await page
    .getByRole('searchbox', { name: '공지 검색' })
    .fill('존재하지않는공지명')
  await expect(page.getByTestId('notice-row')).toHaveCount(0)
  await expect(page.getByText('검색결과가 없습니다')).toBeVisible()
})

test('S5: 페이지네이션 2페이지 이동', async ({ page }) => {
  await page.goto('/notices/list')
  await page.getByRole('button', { name: '2 페이지' }).click()
  await expect(page.getByTestId('notice-row')).toHaveCount(2)
  await expect(page.getByTestId('notice-row').first()).toContainText(
    '시설 점검 일정 공지',
  )
})

test('S6: 분류 탭 변경 시 1페이지로 리셋', async ({ page }) => {
  await page.goto('/notices/list')
  await page.getByRole('button', { name: '2 페이지' }).click()
  await expect(page.getByTestId('notice-row').first()).toContainText(
    '시설 점검 일정 공지',
  )
  await page.getByRole('button', { name: '팀이름 1' }).click()
  await expect(page.getByTestId('notice-row')).toHaveCount(2)
  await expect(page.getByTestId('notice-row').first()).toContainText(
    '신규 프로그램 오픈 안내',
  )
})
