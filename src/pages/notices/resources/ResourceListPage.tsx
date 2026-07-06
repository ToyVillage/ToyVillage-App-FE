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

        <FileTypeTabs types={fileTypeTabs} active={active} onSelect={setActive} />

        <ResourceTable
          resources={resources}
          onRowClick={(id) => navigate(`/notices/resources/${id}`)}
        />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, ${({ theme }) => theme.layout.contentWidth});
  margin: 0 auto;
  padding-top: calc(
    ${({ theme }) => theme.layout.noticeTop} - ${({ theme }) => theme.space.xl}
  );
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space.lg};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.pageTitle};
  font-weight: 600;
  line-height: 1.2;
`

const Subtitle = styled.p`
  margin: ${({ theme }) => theme.space.buttonY} 0 0;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: ${({ theme }) => theme.font.size.subtitle};
  font-weight: 500;
  line-height: 1.2;
`
