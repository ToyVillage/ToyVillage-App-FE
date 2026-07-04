import styled from '@emotion/styled'
import type { Notice } from '../model/types'

interface NoticeTableProps {
  notices: Notice[]
  onRowClick?: (id: string) => void
}

export function NoticeTable({ notices, onRowClick }: NoticeTableProps) {
  return (
    <Table>
      <Header>
        <HeadCell $w="240px">분류</HeadCell>
        <HeadCell $w="840px">제목</HeadCell>
        <HeadCell $w="240px">날짜</HeadCell>
      </Header>
      {notices.map((n) => (
        <Row key={n.id} onClick={() => onRowClick?.(n.id)} data-testid="notice-row">
          <Cell $w="240px">{n.category}</Cell>
          <Cell $w="840px">{n.title}</Cell>
          <Cell $w="240px">{n.date}</Cell>
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
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
