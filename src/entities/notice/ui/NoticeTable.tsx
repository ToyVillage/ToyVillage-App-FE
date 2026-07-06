import { DataTable } from '@/shared/ui'
import type { Notice } from '../model/types'

interface NoticeTableProps {
  notices: Notice[]
  onRowClick?: (id: string) => void
}

// Notice → DataTable row 매핑. 표현은 shared/ui/DataTable 재사용.
export function NoticeTable({ notices, onRowClick }: NoticeTableProps) {
  return (
    <DataTable
      rows={notices.map((n) => ({
        id: n.id,
        pill: n.category,
        title: n.title,
        date: n.date,
      }))}
      onRowClick={onRowClick}
      rowTestId="notice-row"
    />
  )
}
