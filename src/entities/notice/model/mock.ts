import type { Notice } from './types'

// 슬라이스용 mock. 추후 TanStack Query + Axios로 대체.
export const mockNotices: Notice[] = [
  { id: '1', category: '전체', title: '0월 00일 휴관안내', date: '2026.06.30' },
  {
    id: '2',
    category: '팀이름 1',
    title: '신규 프로그램 오픈 안내',
    date: '2026.06.28',
  },
  {
    id: '3',
    category: '팀이름 2',
    title: '주차장 이용 변경 공지',
    date: '2026.06.25',
  },
  {
    id: '4',
    category: '팀이름 3',
    title: '여름 단축 운영 안내',
    date: '2026.06.22',
  },
  {
    id: '5',
    category: '전체',
    title: '시설 점검 일정 공지',
    date: '2026.06.19',
  },
  {
    id: '6',
    category: '팀이름 1',
    title: '회원 혜택 개편 안내',
    date: '2026.06.16',
  },
]

export const noticeCategories = ['전체', '팀이름 1', '팀이름 2', '팀이름 3']
