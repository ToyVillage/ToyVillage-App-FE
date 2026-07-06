import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'

export function NoticeDetailPage() {
  const { id } = useParams()

  return (
    <Page>
      <Title>공지사항 상세</Title>
      <Description>공지 ID: {id}</Description>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSub};
`
