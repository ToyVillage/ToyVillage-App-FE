import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import searchIcon from './assets/search.svg'
import filterIcon from './assets/filter.svg'
import chevronIcon from './assets/chevron-left.svg'

// 분류(pill) / 제목 / 날짜 3컬럼 테이블. 도메인 무관 프레젠테이션 컴포넌트.
// notice·resource 등 목록이 동일 구조라 공통화한다(엔티티가 도메인→row 매핑을 담당).
export interface DataTableRow {
  id: string
  pill: string
  title: string
  date: string
}

// 헤더행 아래에 들어가는 검색바(Figma list 컴포넌트). 상태·필터는 페이지가 소유하고
// 여기서는 표현과 입력 위임만 담당한다. 미지정 시 검색바를 렌더하지 않는다.
export interface DataTableSearch {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export type DataTableSortValue = 'newest' | 'oldest'

export interface DataTableSort {
  value: DataTableSortValue
  onChange: (value: DataTableSortValue) => void
  ariaLabel?: string
}

// 카드 하단 페이지네이션. 실제 슬라이싱은 페이지가 담당하고 여기서는 표현/이동만.
export interface DataTablePagination {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

interface DataTableProps {
  rows: DataTableRow[]
  onRowClick?: (id: string) => void
  rowTestId?: string
  search?: DataTableSearch
  sort?: DataTableSort
  pagination?: DataTablePagination
  emptyLabel?: string
}

export function DataTable({
  rows,
  onRowClick,
  rowTestId,
  search,
  sort,
  pagination,
  emptyLabel,
}: DataTableProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortControlRef = useRef<HTMLDivElement>(null)
  const pageNumbers = pagination
    ? Array.from({ length: pagination.pageCount }, (_, i) => i + 1)
    : []

  useEffect(() => {
    if (!sortOpen) return

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!sortControlRef.current?.contains(event.target as Node)) {
        setSortOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSortOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [sortOpen])

  return (
    <Table>
      <Header>
        <HeadCell $width="category">분류</HeadCell>
        <HeadCell $width="title">제목</HeadCell>
        <HeadCell $width="date">날짜</HeadCell>
      </Header>

      {search && (
        <SearchRow>
          <SearchBar>
            <SearchIcon src={searchIcon} alt="" aria-hidden="true" />
            <SearchInput
              type="search"
              value={search.value}
              placeholder={search.placeholder}
              aria-label={search.ariaLabel ?? '검색'}
              onChange={(e) => search.onChange(e.target.value)}
            />
            {sort ? (
              <SortControl ref={sortControlRef}>
                <SortButton
                  type="button"
                  aria-label={sort.ariaLabel ?? '날짜 정렬'}
                  aria-haspopup="menu"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen((open) => !open)}
                >
                  <FilterIcon src={filterIcon} alt="" aria-hidden="true" />
                </SortButton>
                {sortOpen && (
                  <SortMenu role="menu" aria-label="날짜 정렬 옵션">
                    <SortOption
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort.value === 'newest'}
                      onClick={() => {
                        sort.onChange('newest')
                        setSortOpen(false)
                      }}
                    >
                      최신순
                    </SortOption>
                    <SortOption
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort.value === 'oldest'}
                      onClick={() => {
                        sort.onChange('oldest')
                        setSortOpen(false)
                      }}
                    >
                      오래된순
                    </SortOption>
                  </SortMenu>
                )}
              </SortControl>
            ) : (
              <FilterIcon src={filterIcon} alt="" aria-hidden="true" />
            )}
          </SearchBar>
        </SearchRow>
      )}

      {rows.length === 0 && emptyLabel ? (
        <EmptyRow role="status">{emptyLabel}</EmptyRow>
      ) : (
        rows.map((r) => (
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
        ))
      )}

      {pagination && pagination.pageCount > 1 && (
        <Pagination>
          <PageNav
            type="button"
            aria-label="이전 페이지"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onChange(pagination.page - 1)}
          >
            <ChevronIcon src={chevronIcon} alt="" />
          </PageNav>
          <PageList>
            {pageNumbers.map((n) => (
              <PageButton
                key={n}
                type="button"
                $active={n === pagination.page}
                aria-label={`${n} 페이지`}
                aria-current={n === pagination.page ? 'page' : undefined}
                onClick={() => pagination.onChange(n)}
              >
                {n}
              </PageButton>
            ))}
          </PageList>
          <PageNav
            type="button"
            aria-label="다음 페이지"
            disabled={pagination.page >= pagination.pageCount}
            onClick={() => pagination.onChange(pagination.page + 1)}
          >
            <ChevronIcon src={chevronIcon} alt="" $flip />
          </PageNav>
        </Pagination>
      )}
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

const SearchRow = styled.div`
  padding: 24px 40px 8px;
`

const SearchBar = styled.div`
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 44px;
  background: ${({ theme }) => theme.colors.background};
`

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 20px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
`

const FilterIcon = styled.img`
  width: 22px;
  height: 20px;
  flex: 0 0 22px;
`

const SortControl = styled.div`
  position: relative;
  width: 22px;
  height: 20px;
  flex: 0 0 22px;
`

const SortButton = styled.button`
  display: flex;
  width: 22px;
  height: 20px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 4px;
    border-radius: 2px;
  }
`

const SortMenu = styled.div`
  position: absolute;
  z-index: 1;
  top: 37px;
  right: 0;
  display: flex;
  width: 120px;
  height: 156px;
  flex-direction: column;
  gap: 8px;
  padding: 24px 0;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 8px rgb(0 0 0 / 16%);
`

const SortOption = styled.button`
  flex: 1;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: 0;
    background: ${({ theme }) => theme.colors.background};
  }
`

const EmptyRow = styled.div`
  display: flex;
  min-height: 92px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: 22px;
  font-weight: 500;
`

const Row = styled.div`
  position: relative;
  display: flex;
  min-height: 92px;
  cursor: pointer;

  & + &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 40px;
    right: 40px;
    border-top: 1px solid ${({ theme }) => theme.colors.divider};
  }
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

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
`

const PageNav = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

const ChevronIcon = styled.img<{ $flip?: boolean }>`
  width: 28px;
  height: 28px;
  transform: rotate(${({ $flip }) => ($flip ? '180deg' : '0deg')});
`

const PageList = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const PageButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 24px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentBg : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.pageMuted};
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
`
