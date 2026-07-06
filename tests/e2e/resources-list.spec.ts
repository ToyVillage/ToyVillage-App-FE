import { test, expect } from '@playwright/test'

// 승인된 시나리오(resources-list.approved.json: S1, S2, S3)를 변환한 것.
// AI는 이 파일을 재도출하지 않는다(동결). 실패 시 코드를 수정한다.

test('S1: "자료 추가하기" 클릭 → /notices/resources/create 이동', async ({ page }) => {
  await page.goto('/notices/resources')
  await page.getByRole('link', { name: '자료 추가하기' }).click()
  await expect(page).toHaveURL(/\/notices\/resources\/create$/)
})

test('S2: 파일 유형 탭(pdf) 클릭 → 활성화', async ({ page }) => {
  await page.goto('/notices/resources')
  const tab = page.getByRole('button', { name: 'pdf', exact: true })
  await tab.click()
  await expect(tab).toHaveAttribute('aria-pressed', 'true')
})

test('S3: 자료 행 클릭 → /notices/resources/:id 이동', async ({ page }) => {
  await page.goto('/notices/resources')
  await page.getByTestId('resource-row').first().click()
  await expect(page).toHaveURL(/\/notices\/resources\/[^/]+$/)
})
