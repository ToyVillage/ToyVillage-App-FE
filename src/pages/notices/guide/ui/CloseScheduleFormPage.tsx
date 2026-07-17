import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import { GuideBackLink } from './GuideBackLink'

interface CloseScheduleFormPageProps {
  children: ReactNode
}

export function CloseScheduleFormPage({
  children,
}: CloseScheduleFormPageProps) {
  return (
    <Page>
      <Content>
        <BackRow>
          <GuideBackLink />
        </BackRow>
        {children}
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
