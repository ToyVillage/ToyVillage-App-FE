import { test, expect } from '@playwright/test'

test('사이드바 열기와 닫기', async ({ page }) => {
  await page.goto('/notices/list')

  await page.getByRole('button', { name: '사이드바 열기' }).click()

  const sidebar = page.getByRole('dialog', { name: '사이드바' })
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByText('관리자 1')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(sidebar).toBeHidden()
})

test('사이드바 메뉴 클릭 시 이동하고 닫힘', async ({ page }) => {
  await page.goto('/notices/list')

  await page.getByRole('button', { name: '사이드바 열기' }).click()
  await page.getByRole('link', { name: '자료실 바로가기' }).click()

  await expect(page).toHaveURL(/\/notices\/resources$/)
  await expect(page.getByRole('dialog', { name: '사이드바' })).toBeHidden()
})
