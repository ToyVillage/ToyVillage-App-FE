import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import {
  ResourceTable,
  mockResources,
  fileTypeTabs,
  tabToFileType,
} from '@/entities/resource'
import { CreateResourceButton } from '@/features/create-resource'
import { FileTypeTabs } from './ui/FileTypeTabs'

export function ResourceListPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('전체')

  const resources = useMemo(() => {
    const type = tabToFileType[active]
    return type === null || type === undefined
      ? mockResources
      : mockResources.filter((r) => r.fileType === type)
  }, [active])

  return (
    <Page>
      <Header>
        <div>
          <Title>자료실</Title>
          <Subtitle>토이빌리지의 모든 자료</Subtitle>
        </div>
        <CreateResourceButton />
      </Header>

      <FileTypeTabs types={fileTypeTabs} active={active} onSelect={setActive} />

      <ResourceTable
        resources={resources}
        onRowClick={(id) => navigate(`/notices/resources/${id}`)}
      />
    </Page>
  )
}

const Page = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`

const Subtitle = styled.p`
  margin: ${({ theme }) => theme.space.xs} 0 0;
  color: ${({ theme }) => theme.colors.textSub};
`
