import styled from '@emotion/styled'

// 분류(pill) / 제목 / 날짜 3컬럼 테이블. 도메인 무관 프레젠테이션 컴포넌트.
// notice·resource 등 목록이 동일 구조라 공통화한다(엔티티가 도메인→row 매핑을 담당).
export interface DataTableRow {
  id: string
  pill: string
  title: string
  date: string
}

interface DataTableProps {
  rows: DataTableRow[]
  onRowClick?: (id: string) => void
  rowTestId?: string
}

export function DataTable({ rows, onRowClick, rowTestId }: DataTableProps) {
  return (
    <Table>
      <Header>
        <HeadCell $width="category">분류</HeadCell>
        <HeadCell $width="title">제목</HeadCell>
        <HeadCell $width="date">날짜</HeadCell>
      </Header>
      {rows.map((r) => (
        <Row
          key={r.id}
          data-testid={rowTestId}
          role={onRowClick ? 'link' : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          onClick={onRowClick ? () => onRowClick(r.id) : undefined}
          onKeyDown={
            onRowClick
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRowClick(r.id)
                  }
                }
              : undefined
          }
        >
          <Cell $width="category">
            <Pill>{r.pill}</Pill>
          </Cell>
          <TitleCell $width="title">{r.title}</TitleCell>
          <DateCell $width="date">{r.date}</DateCell>
        </Row>
      ))}
    </Table>
  )
}

type ColumnWidth = 'category' | 'title' | 'date'

function columnWidth(theme: import('@emotion/react').Theme, width: ColumnWidth) {
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

const Pill = styled.span`
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
