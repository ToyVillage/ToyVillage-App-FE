import styled from '@emotion/styled'
import type { Resource } from '../model/types'
import { fileTypeLabel } from '../model/mock'

interface ResourceTableProps {
  resources: Resource[]
  onRowClick?: (id: string) => void
}

export function ResourceTable({ resources, onRowClick }: ResourceTableProps) {
  return (
    <Table>
      <Header>
        <HeadCell $w="240px">분류</HeadCell>
        <HeadCell $w="840px">제목</HeadCell>
        <HeadCell $w="240px">날짜</HeadCell>
      </Header>
      {resources.map((r) => (
        <Row key={r.id} onClick={() => onRowClick?.(r.id)} data-testid="resource-row">
          <Cell $w="240px">
            <TypePill>{fileTypeLabel[r.fileType]}</TypePill>
          </Cell>
          <TitleCell $w="840px">{r.title}</TitleCell>
          <Cell $w="240px">{r.date}</Cell>
        </Row>
      ))}
    </Table>
  )
}

const Table = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.tableHeader};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  cursor: pointer;
`

const HeadCell = styled.div<{ $w: string }>`
  width: ${({ $w }) => $w};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`

const Cell = styled.div<{ $w: string }>`
  width: ${({ $w }) => $w};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.textMuted};
`

const TitleCell = styled(Cell)`
  color: ${({ theme }) => theme.colors.text};
`

const TypePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primaryBg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`
