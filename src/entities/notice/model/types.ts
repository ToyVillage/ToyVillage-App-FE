export interface Notice {
  id: string
  category: string
  title: string
  content: string
  date: string
}

export type CreateNoticeInput = Pick<Notice, 'category' | 'title' | 'content'>
