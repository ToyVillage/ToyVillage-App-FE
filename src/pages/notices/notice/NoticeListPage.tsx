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
