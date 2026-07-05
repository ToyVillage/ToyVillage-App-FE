import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { NoticeTable, mockNotices, noticeCategories } from '@/entities/notice'
import { CreateNoticeButton } from '@/features/create-notice'
import { CategoryTabs } from './ui/CategoryTabs'

export function NoticeListPage() {
  const navigate = useNavigate()
  const [active, setActive] = useState('전체')

  const notices = useMemo(
    () =>
      active === '전체'
        ? mockNotices
        : mockNotices.filter((n) => n.category === active),
    [active],
  )

  return (
    <Page>
      <MenuIcon aria-hidden="true">
        <span />
        <span />
        <span />
      </MenuIcon>

      <Content>
        <Header>
          <div>
            <Title>공지사항</Title>
            <Subtitle>토이빌리지의 중요한 공지사항</Subtitle>
          </div>
          <CreateNoticeButton />
        </Header>

        <CategoryTabs
          categories={noticeCategories}
          active={active}
          onSelect={setActive}
        />

        <NoticeTable
          notices={notices}
          onRowClick={(id) => navigate(`/notices/list/${id}`)}
        />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  position: relative;
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.font.body};
`

const MenuIcon = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.layout.menuY};
  left: ${({ theme }) => theme.layout.menuX};
  display: flex;
  width: ${({ theme }) => theme.layout.menuSize};
  height: ${({ theme }) => theme.layout.menuSize};
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.space.pillY};

  span {
    display: block;
    width: 100%;
    height: ${({ theme }) => theme.space.xs};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.text};
  }
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
