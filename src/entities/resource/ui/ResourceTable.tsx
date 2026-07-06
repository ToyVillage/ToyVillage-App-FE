import { DataTable } from '@/shared/ui'
import type { Resource } from '../model/types'
import { fileTypeLabel } from '../model/mock'

interface ResourceTableProps {
  resources: Resource[]
  onRowClick?: (id: string) => void
}

// Resource → DataTable row 매핑. 표현은 shared/ui/DataTable 재사용.
export function ResourceTable({ resources, onRowClick }: ResourceTableProps) {
  return (
    <DataTable
      rows={resources.map((r) => ({
        id: r.id,
        pill: fileTypeLabel[r.fileType],
        title: r.title,
        date: r.date,
      }))}
      onRowClick={onRowClick}
      rowTestId="resource-row"
    />
  )
}
