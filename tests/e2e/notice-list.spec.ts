import { test, expect } from '@playwright/test'

// 승인된 시나리오(notice-list.approved.json: S1, S2)를 변환한 것.
// AI는 이 파일을 재도출하지 않는다(동결). 실패 시 코드를 수정한다.

test('S1: "공지 생성하기" 클릭 → /notice/create 이동', async ({ page }) => {
  await page.goto('/notice')
  await page.getByRole('link', { name: '공지 생성하기' }).click()
  await expect(page).toHaveURL(/\/notice\/create$/)
})

test('S2: 분류 탭 클릭 → 활성화', async ({ page }) => {
  await page.goto('/notice')
  const tab = page.getByRole('button', { name: '팀이름 1' })
  await tab.click()
  await expect(tab).toHaveAttribute('aria-pressed', 'true')
})
