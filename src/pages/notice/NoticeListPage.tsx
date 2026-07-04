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

      <NoticeTable notices={notices} onRowClick={(id) => navigate(`/notice/${id}`)} />
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
