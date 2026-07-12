import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import plusIcon from './assets/plus.svg'

// + 아이콘 pill 링크 버튼. "공지/자료 생성하기" 등 라우트·라벨만 다른 버튼 공통화.
interface LinkButtonProps {
  to: string
  children: ReactNode
}

export function LinkButton({ to, children }: LinkButtonProps) {
  return (
    <Button to={to}>
      <PlusIcon src={plusIcon} alt="" />
      <span>{children}</span>
    </Button>
  )
}

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.buttonY}
    ${({ theme }) => theme.space.md};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.round};
  text-decoration: none;
  font-weight: 600;
  font-size: ${({ theme }) => theme.font.size.title};
  line-height: 1.2;
`

const PlusIcon = styled.img`
  width: ${({ theme }) => theme.layout.plusIcon};
  height: ${({ theme }) => theme.layout.plusIcon};
  flex: 0 0 ${({ theme }) => theme.layout.plusIcon};
  object-fit: none;
`
