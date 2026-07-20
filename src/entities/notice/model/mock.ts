import type { CreateNoticeInput, Notice } from './types'

export const noticeStorageKey = 'toyvillage:notices'

// 슬라이스용 mock. 추후 TanStack Query + Axios로 대체.
export const mockNotices: Notice[] = [
  {
    id: '1',
    category: '전체',
    title: '0월 00일 휴관안내',
    content: '토이빌리지 휴관 일정을 안내합니다.',
    date: '2026.06.30',
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
  return [...readStoredNotices(), ...mockNotices]
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

function isNotice(value: unknown): value is Notice {
  if (!value || typeof value !== 'object') return false

  const notice = value as Record<string, unknown>
  return (
    typeof notice.id === 'string' &&
    typeof notice.category === 'string' &&
    typeof notice.title === 'string' &&
    typeof notice.content === 'string' &&
    typeof notice.date === 'string'
  )
}

function formatDisplayDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
