import { test, expect } from '@playwright/test'

test('S1: "휴관일 생성하기" 클릭 → /notices/guide/create 이동', async ({
  page,
}) => {
  await page.goto('/notices/guide')
  await page.getByRole('link', { name: '휴관일 생성하기' }).click()
  await expect(page).toHaveURL(/\/notices\/guide\/create$/)
})

test('S2: 다음 달 클릭 → 캘린더 월 변경', async ({ page }) => {
  await page.goto('/notices/guide')
  await page.getByRole('button', { name: '다음 달' }).click()
  await expect(page.getByRole('heading', { name: '2026년 08월' })).toBeVisible()
})

test('S3: 검색 결과 없음 → 빈 상태 표시', async ({ page }) => {
  await page.goto('/notices/guide')
  await page.getByLabel('휴관 일정 검색').fill('검색 결과 없음')
  await expect(page.getByText('아직 추가된 휴관일이 없습니다')).toBeVisible()
})
