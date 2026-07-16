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

function columnWidth(width: ColumnWidth) {
  if (width === 'category') return '240px'
  if (width === 'title') return '840px'
  return '240px'
}

const Table = styled.div`
  width: 100%;
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  min-height: 52px;
  background: ${({ theme }) => theme.colors.tableHeader};
`

const Row = styled.div`
  display: flex;
  min-height: 92px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  cursor: pointer;
`

const HeadCell = styled.div<{ $width: ColumnWidth }>`
  display: flex;
  width: ${({ $width }) => columnWidth($width)};
  align-items: center;
  padding: 12px 40px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 20px;
`

const Cell = styled.div<{ $width: ColumnWidth }>`
  display: flex;
  width: ${({ $width }) => columnWidth($width)};
  align-items: center;
  padding: 12px 40px;
`

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 25px;
  background: ${({ theme }) => theme.colors.primaryBg};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
`

const TitleCell = styled(Cell)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 500;
`

const DateCell = styled(Cell)`
  color: ${({ theme }) => theme.colors.textDate};
  font-size: 22px;
  font-weight: 500;
`
