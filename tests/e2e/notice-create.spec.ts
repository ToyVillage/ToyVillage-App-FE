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
  await expect(page.getByRole('heading', { name: '공지 생성' })).toHaveCount(0)
  await expect(page.getByLabel(/제목/)).toBeVisible()
  await expect(page.getByRole('group', { name: /분류/ })).toBeVisible()
  await expect(page.getByLabel(/내용/)).toBeVisible()
  await expect(page.getByRole('radio', { name: '전체' })).toBeChecked()
  await expect(attachmentGroup(page)).toBeVisible()
  await expect(page.getByTestId('notice-attachment-card')).toBeEmpty()
  await expect(uploadControl(page)).toBeVisible()
  await expect(page.getByRole('button', { name: '생성하기' })).toBeVisible()
})

test('S3: 목록으로 돌아가기', async ({ page }) => {
  await page.getByRole('link', { name: '뒤로가기' }).click()
  await expect(page).toHaveURL(/\/notices\/list$/)
})

test('작성 후 뒤로가기를 누르면 이탈 확인 모달을 표시하고 취소할 수 있다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  const backLink = page.getByRole('link', { name: '뒤로가기' })
  const title = page.getByLabel(/제목/)

  await title.fill('작성 중인 공지')
  await backLink.click()

  const dialog = page.getByRole('alertdialog', {
    name: '정말 나가시겠습니까?',
  })
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('저장하지 않고 돌아갈 시')
  await expect(dialog).toContainText('입력된 정보가 삭제됩니다')
  await expect(dialog).toHaveCSS('width', '600px')
  await expect(dialog).toHaveCSS('min-height', '300px')
  await expect(dialog).toHaveCSS('border-radius', '20px')
  await expect(dialog.getByRole('button', { name: '취소' })).toBeFocused()

  const bounds = await dialog.boundingBox()
  expect(bounds).toEqual({ x: 660, y: 354, width: 600, height: 300 })

  if (process.env.CAPTURE_VISUAL_ARTIFACT === '1') {
    await page.screenshot({
      path: '.omx/artifacts/visual-ralph/notice-create-leave-modal/actual.png',
    })
  }

  await dialog.getByRole('button', { name: '취소' }).click()

  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/notices\/list\/create$/)
  await expect(title).toHaveValue('작성 중인 공지')
  await expect(backLink).toBeFocused()
})

test('이탈 확인 모달에서 확인하면 목록으로 이동한다', async ({ page }) => {
  await page.getByLabel(/제목/).fill('나갈 공지')
  await page.getByRole('link', { name: '뒤로가기' }).click()

  const dialog = page.getByRole('alertdialog', {
    name: '정말 나가시겠습니까?',
  })
  await dialog.getByRole('button', { name: '확인' }).click()

  await expect(page).toHaveURL(/\/notices\/list$/)
})

test('작성 중 사이드바로 이동하려 해도 이탈을 확인한다', async ({
  page,
}) => {
  await page.getByLabel(/제목/).fill('경로를 보호할 공지')
  await page.getByRole('button', { name: '사이드바 열기' }).click()
  await page.getByRole('link', { name: '자료실' }).click()

  const dialog = page.getByRole('alertdialog', {
    name: '정말 나가시겠습니까?',
  })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '취소' }).click()
  await expect(page).toHaveURL(/\/notices\/list\/create$/)
})

test('목록에서 생성 페이지로 진입한 뒤 브라우저 뒤로가기를 해도 이탈을 확인한다', async ({
  page,
}) => {
  await page.goto('/notices/list')
  await page.getByRole('link', { name: '공지 생성하기' }).click()
  await page.getByLabel(/제목/).fill('히스토리를 보호할 공지')
  await page.evaluate(() => history.back())

  const dialog = page.getByRole('alertdialog', {
    name: '정말 나가시겠습니까?',
  })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '취소' }).click()
  await expect(page).toHaveURL(/\/notices\/list\/create$/)
})

test('제목과 내용 입력은 포커스 테두리를 표시하지 않는다', async ({ page }) => {
  const title = page.getByLabel(/제목/)
  const content = page.getByLabel(/내용/)

  await title.focus()
  await expect(title).toHaveCSS('outline-style', 'none')

  await content.focus()
  await expect(content).toHaveCSS('outline-style', 'none')
})

test('내용 입력은 수동 크기 조절 없이 입력량에 맞춰 높이가 늘어난다', async ({
  page,
}) => {
  const content = page.getByLabel(/내용/)
  const initialHeight = await content.evaluate(
    (element) => element.clientHeight,
  )

  await expect(content).toHaveCSS('resize', 'none')
  await content.fill(
    Array.from({ length: 20 }, (_, index) => `${index}`).join('\n'),
  )

  await expect
    .poll(() => content.evaluate((element) => element.clientHeight))
    .toBeGreaterThan(initialHeight)
})

test('S4: 빈 폼은 제목 오류 모달을 표시하고 확인 후 첫 입력에 포커스한다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.getByRole('button', { name: '생성하기' }).click()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('제목을 입력해 주세요')
  await expect(dialog).toHaveCSS('width', '560px')
  await expect(dialog).toHaveCSS('min-height', '320px')
  await expect(dialog).toHaveCSS('border-radius', '20px')
  await expect(dialog.getByRole('button', { name: '확인' })).toBeFocused()

  const bounds = await dialog.boundingBox()
  expect(bounds).toEqual({ x: 680, y: 380, width: 560, height: 320 })

  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByLabel(/제목/)).toBeFocused()
  expect(await readStoredNoticeCount(page)).toBe(0)
})

test('S5: 제목만 입력하면 내용 오류 모달을 표시한다', async ({ page }) => {
  await page.getByLabel(/제목/).fill('제목 입력')
  await page.getByRole('button', { name: '생성하기' }).click()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('내용을 입력해 주세요')
  await dialog.getByRole('button', { name: '확인' }).click()
  await expect(page.getByLabel(/내용/)).toBeFocused()
})

test('S6: 제목과 내용 오류를 화면 순서대로 모달로 검증한다', async ({
  page,
}) => {
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
  await expect(page.getByRole('radio', { name: /팀 이름1/ })).toBeChecked()
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
  await expect(page.getByLabel(/제목/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('radio', { name: '전체' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: '팀 이름1 삭제' }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: '팀 이름2 삭제' }),
  ).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '팀 추가' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByLabel(/내용/)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(uploadControl(page)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '생성하기' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: '확인' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByLabel(/제목/)).toBeFocused()
})

test('팀을 선택해도 핑크로 강조하지 않는다', async ({ page }) => {
  const team = page.getByRole('radio', { name: '팀 이름1' })

  await team.check()

  await expect(team).toBeChecked()
  await expect(page.getByText('팀 이름1', { exact: true })).toHaveCSS(
    'background-color',
    'rgb(245, 245, 247)',
  )
})

test('선택한 팀을 삭제하면 전체 분류로 돌아간다', async ({ page }) => {
  await page.getByLabel(/제목/).fill('제목 입력')
  await page.getByLabel(/내용/).fill('공지 내용')
  await page.getByRole('radio', { name: '팀 이름1' }).check()

  await page.getByRole('button', { name: '팀 이름1 삭제' }).click()

  await expect(page.getByRole('radio', { name: '팀 이름1' })).toHaveCount(0)
  await expect(page.getByRole('radio', { name: '전체' })).toBeChecked()
  await page.getByRole('button', { name: '생성하기' }).click()
  await expect(page).toHaveURL(/\/notices\/list$/)
  await expect(page.getByText('제목 입력')).toHaveCount(1)
})

test('팀 추가 버튼을 누르면 팀 이름 입력 모달을 표시하고 취소할 수 있다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1651, height: 1248 })
  const addButton = page.getByRole('button', { name: '팀 추가' })
  await addButton.click()

  const dialog = page.getByRole('dialog', { name: '팀 추가하기' })
  const teamNameInput = dialog.getByRole('textbox', { name: '팀 이름' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveCSS('width', '600px')
  await expect(dialog).toHaveCSS('min-height', '370px')
  await expect(dialog).toBeFocused()
  await expect(dialog).toHaveCSS('outline-style', 'none')
  await expect(teamNameInput).not.toBeFocused()
  await teamNameInput.focus()
  await expect(teamNameInput).toHaveCSS('outline-style', 'none')
  await expect(dialog.getByRole('button', { name: '취소' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: '다음' })).toBeVisible()

  if (process.env.CAPTURE_VISUAL_ARTIFACT === '1') {
    await page.screenshot({
      path: '.omx/artifacts/visual-ralph/team-add-dialog/actual.png',
    })
  }

  await dialog.getByRole('button', { name: '취소' }).click()

  await expect(dialog).toBeHidden()
  await expect(addButton).toBeFocused()
})

test('모달에 입력한 이름으로 팀을 추가한다', async ({ page }) => {
  await page.getByRole('button', { name: '팀 추가' }).click()
  const dialog = page.getByRole('dialog', { name: '팀 추가하기' })
  await dialog.getByRole('textbox', { name: '팀 이름' }).fill('새 팀')
  await dialog.getByRole('button', { name: '다음' }).click()

  await expect(page.getByRole('dialog', { name: '팀 추가하기' })).toBeHidden()
  await expect(page.getByRole('radio', { name: '새 팀' })).toBeChecked()
  await expect(page.getByRole('button', { name: '새 팀 삭제' })).toBeVisible()
})

test('S11: 첨부파일 영역은 빈 첨부 카드와 업로드 dropzone을 표시한다', async ({
  page,
}) => {
  const attachments = attachmentGroup(page)
  const emptyCard = page.getByTestId('notice-attachment-card')
  const upload = uploadControl(page)

  await expect(attachments).toBeVisible()
  await expect(emptyCard).toBeVisible()
  await expect(emptyCard).toBeEmpty()
  await expect(upload).toBeVisible()
  await expect(upload).toHaveCSS('background-color', 'rgb(225, 225, 225)')
  await expect(upload).toHaveCSS('border-color', 'rgb(132, 132, 145)')

  await upload.hover()
  await expect(upload).toHaveCSS('background-color', 'rgb(225, 225, 225)')
  await expect(upload).toHaveCSS('border-color', 'rgb(132, 132, 145)')

  const emptyCardBounds = await emptyCard.boundingBox()
  const uploadBounds = await upload.boundingBox()
  expect(emptyCardBounds).not.toBeNull()
  expect(uploadBounds).not.toBeNull()
  expect(emptyCardBounds!.y).toBeLessThan(uploadBounds!.y)
})

test('S12: 여러 파일을 선택하면 파일명 chip과 삭제 control을 표시한다', async ({
  page,
}) => {
  await uploadInput(page).setInputFiles([
    filePayload('운영 안내.pdf', 'application/pdf'),
    filePayload('행사 이미지.png', 'image/png'),
  ])

  await expect(attachmentGroup(page).getByText('운영 안내.pdf')).toBeVisible()
  await expect(attachmentGroup(page).getByText('행사 이미지.png')).toBeVisible()
  await expect(
    page.getByRole('button', { name: '운영 안내.pdf 삭제' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '행사 이미지.png 삭제' }),
  ).toBeVisible()

  const categoryRemove = page.getByRole('button', { name: '팀 이름1 삭제' })
  const attachmentRemove = page.getByRole('button', {
    name: '운영 안내.pdf 삭제',
  })

  for (const removeButton of [categoryRemove, attachmentRemove]) {
    await expect(removeButton).toHaveCSS('width', '20px')
    await expect(removeButton).toHaveCSS('height', '20px')
    await expect(removeButton).toHaveCSS('color', 'rgb(132, 132, 145)')
    await expect(removeButton).toHaveCSS('border-style', 'none')

    await removeButton.hover()
    await expect(removeButton).toHaveCSS('color', 'rgb(255, 49, 49)')
  }
})

test('S13: 첨부 파일을 제거하면 빈 첨부 카드로 돌아간다', async ({ page }) => {
  await uploadInput(page).setInputFiles([
    filePayload('삭제할 파일.txt', 'text/plain'),
  ])

  await page.getByRole('button', { name: '삭제할 파일.txt 삭제' }).click()

  await expect(attachmentGroup(page).getByText('삭제할 파일.txt')).toHaveCount(
    0,
  )
  await expect(page.getByTestId('notice-attachment-card')).toBeEmpty()
})

async function fillValidNotice(page: Page, title: string) {
  await page.getByRole('radio', { name: /팀 이름1/ }).check()
  await page.getByLabel(/제목/).fill(title)
  await page.getByLabel(/내용/).fill('공지 내용입니다.')
}

function attachmentGroup(page: Page) {
  return page.getByRole('group', { name: '첨부파일' })
}

function uploadControl(page: Page) {
  return page.getByRole('button', { name: '파일 업로드' })
}

function uploadInput(page: Page) {
  return page.getByLabel('첨부파일 선택')
}

function filePayload(name: string, mimeType: string) {
  return {
    name,
    mimeType,
    buffer: Buffer.from(`fixture for ${name}`),
  }
}

async function readStoredNoticeCount(page: Page): Promise<number> {
  return page.evaluate((storageKey) => {
    const value = localStorage.getItem(storageKey)
    return value ? JSON.parse(value).length : 0
  }, noticeStorageKey)
}
