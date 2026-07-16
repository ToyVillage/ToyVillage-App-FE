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
  padding: 0 ${({ theme }) => theme.space.xl};
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.font.body};
`

const Content = styled.div`
  width: min(100%, ${({ theme }) => theme.layout.contentWidth});
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.layout.createTop};
`

const BackRow = styled.div`
  margin: 0 0 ${({ theme }) => theme.layout.createBackGap};
`
