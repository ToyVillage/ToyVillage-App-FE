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
        <HeadCell $width="category">분류</HeadCell>
        <HeadCell $width="title">제목</HeadCell>
        <HeadCell $width="date">날짜</HeadCell>
      </Header>
      {notices.map((n) => (
        <Row
          key={n.id}
          onClick={() => onRowClick?.(n.id)}
          data-testid="notice-row"
        >
          <Cell $width="category">
            <CategoryPill>{n.category}</CategoryPill>
          </Cell>
          <TitleCell $width="title">{n.title}</TitleCell>
          <DateCell $width="date">{n.date}</DateCell>
        </Row>
      ))}
    </Table>
  )
}

type ColumnWidth = 'category' | 'title' | 'date'

function columnWidth(
  theme: import('@emotion/react').Theme,
  width: ColumnWidth,
) {
  if (width === 'category') return theme.layout.tableCategoryWidth
  if (width === 'title') return theme.layout.tableTitleWidth
  return theme.layout.tableDateWidth
}

const Table = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.layout.tableOffset};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.table};
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  min-height: ${({ theme }) => theme.layout.tableHeaderHeight};
  background: ${({ theme }) => theme.colors.tableHeader};
`

const Row = styled.div`
  display: flex;
  min-height: ${({ theme }) => theme.layout.tableRowHeight};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  cursor: pointer;
`

const HeadCell = styled.div<{ $width: ColumnWidth }>`
  display: flex;
  width: ${({ theme, $width }) => columnWidth(theme, $width)};
  align-items: center;
  padding: ${({ theme }) => theme.space.buttonY}
    ${({ theme }) => theme.space.tableX};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: ${({ theme }) => theme.font.size.tableHeader};
`

const Cell = styled.div<{ $width: ColumnWidth }>`
  display: flex;
  width: ${({ theme, $width }) => columnWidth(theme, $width)};
  align-items: center;
  padding: ${({ theme }) => theme.space.buttonY}
    ${({ theme }) => theme.space.tableX};
`

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.pillY}
    ${({ theme }) => theme.space.buttonY};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primaryBg};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.font.size.category};
  font-weight: 500;
  line-height: 1.2;
`

const TitleCell = styled(Cell)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.title};
  font-weight: 500;
`

const DateCell = styled(Cell)`
  color: ${({ theme }) => theme.colors.textDate};
  font-size: ${({ theme }) => theme.font.size.date};
  font-weight: 500;
`
