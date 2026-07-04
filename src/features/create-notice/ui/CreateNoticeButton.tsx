import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export function CreateNoticeButton() {
  return <Button to="/notice/create">+ 공지 생성하기</Button>
}

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.md};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.round};
  text-decoration: none;
  font-weight: 600;
`
