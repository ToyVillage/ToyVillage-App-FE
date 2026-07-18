import { expect, test, type Page } from '@playwright/test'
import { noticeStorageKey } from '../../src/entities/notice/model/mock'

test.beforeEach(async ({ page }) => {
  await page.goto('/notices/list/create')
  await page.evaluate(
    (storageKey) => localStorage.removeItem(storageKey),
    noticeStorageKey,
  )
  await page.reload()
})

test('S2: 생성 폼 표시', async ({ page }) => {
  await expect(page.getByRole('link', { name: '뒤로가기' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '공지 생성' })).toBeVisible()
  await expect(page.getByLabel(/분류/)).toBeVisible()
  await expect(page.getByLabel(/제목/)).toBeVisible()
  await expect(page.getByLabel(/내용/)).toBeVisible()
  await expect(page.getByRole('button', { name: '생성하기' })).toBeVisible()
})

test('S3: 목록으로 돌아가기', async ({ page }) => {
  await page.getByRole('link', { name: '뒤로가기' }).click()
  await expect(page).toHaveURL(/\/notices\/list$/)
})

test('S4: 빈 폼은 분류 오류 모달을 표시하고 확인 후 첫 입력에 포커스한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.getByRole('button', { name: '생성하기' }).click()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('분류를 선택해 주세요')
  await expect(dialog).toHaveCSS('width', '560px')
  await expect(dialog).toHaveCSS('min-height', '320px')
  await expect(dialog).toHaveCSS('border-radius', '20px')
  await expect(dialog.getByRole('button', { name: '확인' })).toBeFocused()

  const bounds = await dialog.boundingBox()
  expect(bounds).toEqual({ x: 680, y: 380, width: 560, height: 320 })

  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByLabel(/분류/)).toBeFocused()
  expect(await readStoredNoticeCount(page)).toBe(0)
})

test('S5: 분류만 선택하면 제목 오류 모달을 표시한다', async ({ page }) => {
  await page.getByLabel(/분류/).selectOption('팀이름 1')
  await page.getByRole('button', { name: '생성하기' }).click()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('제목을 입력해 주세요')
  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(page.getByLabel(/제목/)).toBeFocused()
})

test('S6: 제목과 내용 오류를 순서대로 모달로 검증한다', async ({ page }) => {
  await page.getByLabel(/분류/).selectOption('팀이름 1')
  await page.getByLabel(/제목/).fill('   ')
  await page.getByLabel(/내용/).fill('\n   ')
  await page.getByRole('button', { name: '생성하기' }).click()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('제목을 입력해 주세요')
  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(page.getByLabel(/제목/)).toBeFocused()

  await page.getByLabel(/제목/).fill('제목 입력')
  await page.getByRole('button', { name: '생성하기' }).click()
  await expect(dialog).toContainText('내용을 입력해 주세요')
  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(page.getByLabel(/내용/)).toBeFocused()
  expect(await readStoredNoticeCount(page)).toBe(0)
})

test('S7: 유효한 값으로 생성하면 목록에서 확인할 수 있다', async ({ page }) => {
  await fillValidNotice(page, '새 공지사항')
  await page.getByRole('button', { name: '생성하기' }).click()

  await expect(page).toHaveURL(/\/notices\/list$/)
  await expect(page.getByText('새 공지사항')).toHaveCount(1)
  expect(await readStoredNoticeCount(page)).toBe(1)
})

test('S8: 연속 제출해도 공지를 한 번만 생성한다', async ({ page }) => {
  await fillValidNotice(page, '한 번만 생성할 공지')

  await page.getByRole('button', { name: '생성하기' }).evaluate((button) => {
    const form = button.closest('form')
    form?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    )
    form?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    )
  })

  await expect(page).toHaveURL(/\/notices\/list$/)
  expect(await readStoredNoticeCount(page)).toBe(1)
})

test('S9: 저장 실패 시 입력을 보존하고 다시 제출할 수 있다', async ({
  page,
}) => {
  await page.evaluate((storageKey) => {
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === storageKey) throw new DOMException('저장 실패')
      originalSetItem.call(this, key, value)
    }
  }, noticeStorageKey)

  await fillValidNotice(page, '보존할 공지')
  await page.getByRole('button', { name: '생성하기' }).click()

  await expect(page).toHaveURL(/\/notices\/list\/create$/)
  await expect(page.getByLabel(/분류/)).toHaveValue('팀이름 1')
  await expect(page.getByLabel(/제목/)).toHaveValue('보존할 공지')
  await expect(page.getByLabel(/내용/)).toHaveValue('공지 내용입니다.')
  await expect(
    page.getByText('생성하지 못했습니다. 다시 시도해 주세요.'),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: '생성하기' })).toBeEnabled()
})

test('S10: 키보드 순서와 오류 포커스 이동', async ({ page }) => {
  const backLink = page.getByRole('link', { name: '뒤로가기' })
  await backLink.focus()
  await expect(backLink).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/분류/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/제목/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/내용/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '생성하기' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '확인' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByLabel(/분류/)).toBeFocused()
})

async function fillValidNotice(page: Page, title: string) {
  await page.getByLabel(/분류/).selectOption('팀이름 1')
  await page.getByLabel(/제목/).fill(title)
  await page.getByLabel(/내용/).fill('공지 내용입니다.')
}

async function readStoredNoticeCount(page: Page): Promise<number> {
  return page.evaluate((storageKey) => {
    const value = localStorage.getItem(storageKey)
    return value ? JSON.parse(value).length : 0
  }, noticeStorageKey)
}
