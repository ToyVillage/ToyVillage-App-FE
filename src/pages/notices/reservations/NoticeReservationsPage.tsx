import styled from '@emotion/styled'

export function NoticeReservationsPage() {
  return (
    <Page>
      <Title>단체예약현황</Title>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: 32px;
  background: ${({ theme }) => theme.colors.background};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`
