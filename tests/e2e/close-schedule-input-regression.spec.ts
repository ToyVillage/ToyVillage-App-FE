import { expect, test } from '@playwright/test'

test('날짜 입력 영역 클릭 시 브라우저 선택기를 연다', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLInputElement.prototype.showPicker = function showPicker() {
      const root = document.documentElement
      const calls = Number(root.dataset.showPickerCalls ?? '0')
      root.dataset.showPickerCalls = String(calls + 1)
    }
  })
  await page.goto('/notices/guide/create')

  await page.getByLabel('시작일').click()

  await expect
    .poll(() => page.locator('html').getAttribute('data-show-picker-calls'))
    .toBe('1')
})

test('제목 입력에 포커스해도 하단 라인을 표시하지 않는다', async ({ page }) => {
  await page.goto('/notices/guide/create')
  const titleInput = page.getByLabel(/제목/)

  await titleInput.click()

  await expect(titleInput).toBeFocused()
  await expect
    .poll(() =>
      titleInput.evaluate(
        (element) => getComputedStyle(element).borderBottomStyle,
      ),
    )
    .toBe('none')
})
