import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ResourceTable,
  getMockResources,
  mockResources,
  fileTypeTabs,
  fileTypeLabel,
  tabToFileType,
} from '@/entities/resource'
import { CreateResourceButton } from '@/features/create-resource'
import { FileTypeTabs } from './ui/FileTypeTabs'

// 한 페이지에 노출할 자료 수(Figma list 컴포넌트 기준). 공지와 동일.
const PAGE_SIZE = 4

export function ResourceListPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('전체')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { data: allResources = mockResources } = useQuery({
    queryKey: ['resources'],
    queryFn: getMockResources,
    placeholderData: mockResources,
  })

  const filtered = useMemo(() => {
    const type = tabToFileType[active]
    const byType =
      type === null || type === undefined
        ? allResources
        : allResources.filter((resource) => resource.fileType === type)

    const keyword = query.trim().toLowerCase()
    if (!keyword) return byType

    return byType.filter((resource) =>
      `${resource.title} ${fileTypeLabel[resource.fileType]} ${resource.date}`
        .toLowerCase()
        .includes(keyword),
    )
  }, [active, allResources, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const filterKey = `${active} ${query}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey)
    setPage(1)
  }
  const currentPage = Math.min(page, pageCount)

  const resources = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  )

  return (
    <Page>
      <Content>
        <Header>
          <div>
            <Title>자료실</Title>
            <Subtitle>토이빌리지의 모든 자료</Subtitle>
          </div>
          <CreateResourceButton />
        </Header>

        <FileTypeTabs
          types={fileTypeTabs}
          active={active}
          onSelect={setActive}
        />

        <ResourceTable
          resources={resources}
          onRowClick={(id) => navigate(`/notices/resources/${id}`)}
          search={{
            value: query,
            onChange: setQuery,
            placeholder: '제목을 입력해주세요',
            ariaLabel: '자료 검색',
          }}
          pagination={{ page: currentPage, pageCount, onChange: setPage }}
          emptyLabel={
            query.trim() ? '검색결과가 없습니다' : '표시할 자료가 없습니다'
          }
        />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  padding: 32px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding-top: calc(124px - 32px);
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 60px;
  font-weight: 600;
  line-height: 1.2;
`

const Subtitle = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
`
