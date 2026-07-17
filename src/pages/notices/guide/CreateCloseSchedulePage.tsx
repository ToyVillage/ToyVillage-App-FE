import styled from '@emotion/styled'
import { CloseScheduleForm } from '@/features/create-close-schedule'
import { GuideBackLink } from './ui/GuideBackLink'

export function CreateCloseSchedulePage() {
  return (
    <Page>
      <Content>
        <BackRow>
          <GuideBackLink />
        </BackRow>
        <CloseScheduleForm />
      </Content>
    </Page>
  )
}

const Page = styled.main`
  min-height: 100vh;
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, 1320px);
  margin: 0 auto;
  padding-top: 80px;
`

const BackRow = styled.div`
  margin: 0 0 35px;
`
