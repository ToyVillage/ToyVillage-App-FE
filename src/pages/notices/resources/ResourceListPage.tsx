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
