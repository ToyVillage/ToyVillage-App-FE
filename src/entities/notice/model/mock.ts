import type { CreateNoticeInput, Notice, UpdateNoticeInput } from './types'

export const noticeStorageKey = 'toyvillage:notices'
export const deletedNoticeStorageKey = 'toyvillage:notices:deleted'

// 슬라이스용 mock. 추후 TanStack Query + Axios로 대체.
export const mockNotices: Notice[] = [
  {
    id: '1',
    category: '전체',
    title: '7월 13일 휴관안내',
    content:
      '그냥 더미 텍스트 입니다. 별 신경 쓰지 마세요. 별 의미 없거든요. 여기까지 읽은거면 내 말은 귓등으로 듣는거겠죠? 에레레레레레레렐',
    date: '2026.07.13',
    attachments: ['당일 지침.pdf', '휴관안내.png', '휴관안내.jpg'],
  },
  {
    id: '2',
    category: '팀이름 1',
    title: '신규 프로그램 오픈 안내',
    content: '새롭게 시작하는 프로그램을 안내합니다.',
    date: '2026.06.28',
  },
  {
    id: '3',
    category: '팀이름 2',
    title: '주차장 이용 변경 공지',
    content: '주차장 이용 방법 변경 사항을 안내합니다.',
    date: '2026.06.25',
  },
  {
    id: '4',
    category: '팀이름 3',
    title: '여름 단축 운영 안내',
    content: '여름철 단축 운영 일정을 안내합니다.',
    date: '2026.06.22',
  },
  {
    id: '5',
    category: '전체',
    title: '시설 점검 일정 공지',
    content: '시설 점검 일정을 안내합니다.',
    date: '2026.06.19',
  },
  {
    id: '6',
    category: '팀이름 1',
    title: '회원 혜택 개편 안내',
    content: '회원 혜택 개편 내용을 안내합니다.',
    date: '2026.06.16',
  },
]

export const noticeCategories = ['전체', '팀이름 1', '팀이름 2', '팀이름 3']

export async function getMockNotices(): Promise<Notice[]> {
  const storedNotices = readStoredNotices()
  const storedById = new Map(storedNotices.map((notice) => [notice.id, notice]))
  const deletedIds = readDeletedNoticeIds()
  const mergedMocks = mockNotices
    .filter((notice) => !deletedIds.has(notice.id))
    .map((notice) => storedById.get(notice.id) ?? notice)
  const createdNotices = storedNotices.filter(
    (notice) => !mockNotices.some((mockNotice) => mockNotice.id === notice.id),
  )

  return [...createdNotices, ...mergedMocks]
}

export async function getMockNotice(id: string): Promise<Notice | null> {
  const notices = await getMockNotices()
  return notices.find((notice) => notice.id === id) ?? null
}

export async function createMockNotice(
  input: CreateNoticeInput,
): Promise<Notice> {
  const notice: Notice = {
    id: `created-${crypto.randomUUID()}`,
    ...input,
    date: formatDisplayDate(new Date()),
  }
  const storedNotices = readStoredNotices()

  localStorage.setItem(
    noticeStorageKey,
    JSON.stringify([notice, ...storedNotices]),
  )

  return notice
}

export async function updateMockNotice({
  id,
  input,
}: {
  id: string
  input: UpdateNoticeInput
}): Promise<Notice> {
  const currentNotice = await getMockNotice(id)
  if (!currentNotice) throw new Error('Notice not found')

  const updatedNotice: Notice = {
    ...currentNotice,
    ...input,
    attachments: input.attachments ?? [],
  }
  const storedNotices = readStoredNotices()
  const nextNotices = [
    updatedNotice,
    ...storedNotices.filter((notice) => notice.id !== id),
  ]

  localStorage.setItem(noticeStorageKey, JSON.stringify(nextNotices))
  return updatedNotice
}

export async function deleteMockNotice(id: string): Promise<void> {
  const currentNotice = await getMockNotice(id)
  if (!currentNotice) throw new Error('Notice not found')

  const nextNotices = readStoredNotices().filter((notice) => notice.id !== id)
  const deletedIds = readDeletedNoticeIds()
  deletedIds.add(id)

  localStorage.setItem(noticeStorageKey, JSON.stringify(nextNotices))
  localStorage.setItem(deletedNoticeStorageKey, JSON.stringify([...deletedIds]))
}

function readStoredNotices(): Notice[] {
  const rawNotices = localStorage.getItem(noticeStorageKey)
  if (!rawNotices) return []

  try {
    const notices: unknown = JSON.parse(rawNotices)
    return Array.isArray(notices) ? notices.filter(isNotice) : []
  } catch {
    return []
  }
}

function readDeletedNoticeIds(): Set<string> {
  const rawIds = localStorage.getItem(deletedNoticeStorageKey)
  if (!rawIds) return new Set()

  try {
    const ids: unknown = JSON.parse(rawIds)
    return new Set(
      Array.isArray(ids)
        ? ids.filter((id): id is string => typeof id === 'string')
        : [],
    )
  } catch {
    return new Set()
  }
}

function isNotice(value: unknown): value is Notice {
  if (!value || typeof value !== 'object') return false

  const notice = value as Record<string, unknown>
  return (
    typeof notice.id === 'string' &&
    typeof notice.category === 'string' &&
    typeof notice.title === 'string' &&
    typeof notice.content === 'string' &&
    typeof notice.date === 'string' &&
    (notice.attachments === undefined ||
      (Array.isArray(notice.attachments) &&
        notice.attachments.every((name) => typeof name === 'string')))
  )
}

function formatDisplayDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
