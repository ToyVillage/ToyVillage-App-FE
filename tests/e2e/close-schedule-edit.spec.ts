import { expect, test } from '@playwright/test'
import { closeScheduleStorageKey } from '@/entities/close-schedule'

const scheduleId = 'animal-checkup'
const editPath = `/notices/guide/${scheduleId}/edit`

test.beforeEach(async ({ page }) => {
  await page.goto('/notices/guide')
  await page.evaluate(
    (storageKey) => localStorage.removeItem(storageKey),
    closeScheduleStorageKey,
  )
  await page.reload()
})

test('S1: 오른쪽 휴관 일정 카드 → 해당 일정 수정 화면 이동', async ({
  page,
}) => {
  await page
    .getByRole('link', {
      name: '토이빌리지 동물 정기검진 휴관 일정 수정',
    })
    .click()

  await expect(page).toHaveURL(editPath)
  await expect(page.getByRole('button', { name: '수정하기' })).toBeVisible()
})

test('S2: 수정 페이지 → 기존 날짜와 제목 표시', async ({ page }) => {
  await page.goto(editPath)

  await expect(page.getByLabel('시작일')).toHaveValue('2026-07-13')
  await expect(page.getByLabel('종료일')).toHaveValue('2026-07-14')
  await expect(page.getByLabel(/제목/)).toHaveValue('토이빌리지 동물 정기검진')
})

test('S3: 유효한 값 수정 → 동일 ID 카드 하나에 수정값 반영', async ({
  page,
}) => {
  await page.goto(editPath)
  await page.getByLabel('시작일').fill('2026-07-15')
  await page.getByLabel('종료일').fill('2026-07-16')
  await page.getByLabel(/제목/).fill('수정된 정기검진')

  await page.getByRole('button', { name: '수정하기' }).click()

  await expect(page).toHaveURL('/notices/guide')
  const editedCard = page.getByRole('link', {
    name: '수정된 정기검진 휴관 일정 수정',
  })
  await expect(editedCard).toHaveCount(1)
  await expect(editedCard).toContainText('7월 15일 ~ 7월 16일')
  await expect(page.getByText('토이빌리지 동물 정기검진')).toHaveCount(0)
  await expect
    .poll(() =>
      page.evaluate((storageKey) => {
        const value = localStorage.getItem(storageKey)
        const schedules = value ? JSON.parse(value) : []
        return schedules.filter(
          (schedule: { id?: string }) => schedule.id === 'animal-checkup',
        ).length
      }, closeScheduleStorageKey),
    )
    .toBe(1)
})

test('S4: 잘못된 입력 → 수정하지 않고 오류 dialog 표시', async ({ page }) => {
  await page.goto(editPath)
  await page.getByLabel('시작일').fill('')
  await page.getByRole('button', { name: '수정하기' }).click()
  await expect(page.getByRole('alertdialog')).toContainText(
    '휴관일을 입력해 주세요',
  )
  await page.getByRole('button', { name: '확인' }).click()

  await page.getByLabel('시작일').fill('2026-07-20')
  await page.getByLabel('종료일').fill('2026-07-19')
  await page.getByRole('button', { name: '수정하기' }).click()
  await expect(page.getByRole('alertdialog')).toContainText(
    '종료일은 시작일과 같거나 이후여야 합니다',
  )
  await page.getByRole('button', { name: '확인' }).click()

  await page.getByLabel('종료일').fill('2026-07-20')
  await page.getByLabel(/제목/).fill('   ')
  await page.getByRole('button', { name: '수정하기' }).click()
  await expect(page.getByRole('alertdialog')).toContainText(
    '제목을 입력해 주세요',
  )
  await expect
    .poll(() =>
      page.evaluate(
        (storageKey) => localStorage.getItem(storageKey),
        closeScheduleStorageKey,
      ),
    )
    .toBeNull()
})

test('S5: 존재하지 않는 일정 ID → 휴관일 관리로 replace 이동', async ({
  page,
}) => {
  await page.goto('/notices/guide/missing-schedule/edit')

  await expect(page).toHaveURL('/notices/guide')
  await expect(page.getByRole('heading', { name: '휴관일 관리' })).toBeVisible()
})

test('S6: 수정 실패 → URL과 입력값 유지', async ({ page }) => {
  await page.goto(editPath)
  await page.evaluate((storageKey) => {
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === storageKey) throw new DOMException('저장 실패')
      originalSetItem.call(this, key, value)
    }
  }, closeScheduleStorageKey)
  await page.getByLabel(/제목/).fill('보존할 수정 제목')

  await page.getByRole('button', { name: '수정하기' }).click()

  await expect(page).toHaveURL(editPath)
  await expect(page.getByRole('status')).toHaveText(
    '수정하지 못했습니다. 다시 시도해 주세요.',
  )
  await expect(page.getByLabel(/제목/)).toHaveValue('보존할 수정 제목')
  await expect(page.getByRole('button', { name: '수정하기' })).toBeEnabled()
})

test('S7: 키보드만으로 카드 진입·제목 편집·수정 저장', async ({ page }) => {
  const scheduleCard = page.getByRole('link', {
    name: '토이빌리지 동물 정기검진 휴관 일정 수정',
  })
  await scheduleCard.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(editPath)

  const backLink = page.getByRole('link', { name: '뒤로가기' })
  await backLink.focus()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('시작일')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('종료일')).toBeFocused()
  await page.keyboard.press('Tab')
  const titleInput = page.getByLabel(/제목/)
  await expect(titleInput).toBeFocused()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.type('키보드 수정 일정')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '수정하기' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL('/notices/guide')
  await expect(
    page.getByRole('link', { name: '키보드 수정 일정 휴관 일정 수정' }),
  ).toHaveCount(1)
})
