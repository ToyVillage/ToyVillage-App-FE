import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useSidebarStore } from '../model/useSidebarStore'

export function SidebarToggleButton() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)
  const isOpen = useSidebarStore((state) => state.isOpen)
  const open = useSidebarStore((state) => state.open)

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      buttonRef.current?.focus()
    }

    wasOpenRef.current = isOpen
  }, [isOpen])

  return (
    <Button
      ref={buttonRef}
      type="button"
      aria-label="사이드바 열기"
      aria-expanded={isOpen}
      onClick={open}
    >
      <Line />
      <Line />
      <Line />
    </Button>
  )
}

const Button = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.layout.menuY};
  left: ${({ theme }) => theme.layout.menuX};
  z-index: ${({ theme }) => theme.layout.sidebarZIndex - 1};
  display: inline-flex;
  width: ${({ theme }) => theme.layout.menuSize};
  height: ${({ theme }) => theme.layout.menuSize};
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.space.pillY};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`

const Line = styled.span`
  display: block;
  width: 100%;
  height: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: currentColor;
`
