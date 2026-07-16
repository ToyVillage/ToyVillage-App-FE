import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'

interface ValidationDialogProps {
  message: string
  onConfirm: () => void
}

export function ValidationDialog({
  message,
  onConfirm,
}: ValidationDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const appRoot = document.getElementById('root')
    appRoot?.setAttribute('inert', '')
    appRoot?.setAttribute('aria-hidden', 'true')
    confirmRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onConfirm()
      }

      if (event.key === 'Tab') {
        event.preventDefault()
        confirmRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      appRoot?.removeAttribute('inert')
      appRoot?.removeAttribute('aria-hidden')
    }
  }, [onConfirm])

  return createPortal(
    <Overlay>
      <Dialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="close-schedule-validation-message"
      >
        <Message id="close-schedule-validation-message">{message}</Message>
        <ConfirmButton ref={confirmRef} type="button" onClick={onConfirm}>
          확인
        </ConfirmButton>
      </Dialog>
    </Overlay>,
    document.body,
  )
}

const Overlay = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.layout.sidebarZIndex + 1};
  inset: 0;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.overlayStrong};
`

const Dialog = styled.div`
  display: flex;
  width: min(
    calc(100% - ${({ theme }) => theme.space.tableX} * 2),
    ${({ theme }) => theme.layout.createDialogWidth}
  );
  min-height: ${({ theme }) => theme.layout.createDialogHeight};
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space.tableX}
    ${({ theme }) => theme.layout.createDialogInset}
    ${({ theme }) => theme.layout.createDialogInset};
  border-radius: ${({ theme }) => theme.radius.table};
  background: ${({ theme }) => theme.colors.surface};
`

const Message = styled.p`
  margin: ${({ theme }) => theme.layout.createDialogMessageTop} 0 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.dialog};
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
`

const ConfirmButton = styled.button`
  width: 100%;
  min-height: ${({ theme }) => theme.layout.createDialogButtonHeight};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font: inherit;
  font-size: ${({ theme }) => theme.font.size.dialog};
  font-weight: 500;

  &:focus-visible {
    outline: ${({ theme }) => theme.radius.sm} solid
      ${({ theme }) => theme.colors.primary};
    outline-offset: ${({ theme }) => theme.space.xs};
  }
`
