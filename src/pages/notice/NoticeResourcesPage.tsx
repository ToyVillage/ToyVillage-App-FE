import styled from '@emotion/styled'

export function NoticeResourcesPage() {
  return (
    <Page>
      <Title>자료실</Title>
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
