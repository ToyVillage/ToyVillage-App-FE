import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

export function CreateResourceButton() {
  return <Button to="/notices/resources/create">+ 자료 추가하기</Button>
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
