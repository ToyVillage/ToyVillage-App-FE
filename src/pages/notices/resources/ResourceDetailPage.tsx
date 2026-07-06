import styled from '@emotion/styled'
import { useParams } from 'react-router-dom'

// 슬라이스 스텁: 행 클릭 이동 대상. 상세 내용은 추후.
export function ResourceDetailPage() {
  const { id } = useParams()
  return (
    <Page>
      <Title>자료 상세 #{id}</Title>
    </Page>
  )
}

const Page = styled.main`
  padding: ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`
