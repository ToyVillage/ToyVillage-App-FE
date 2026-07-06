import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router-dom'
import calendarIcon from './assets/calendar.svg'
import chevronLeftIcon from './assets/chevron-left.svg'
import megaphoneIcon from './assets/megaphone.svg'
import peopleIcon from './assets/people.svg'
import storageIcon from './assets/storage.svg'
import { mockSidebarItems, mockSidebarUser } from '../model/mock'
import { useSidebarStore } from '../model/useSidebarStore'
import type { SidebarIconName, SidebarNavItem } from '../model/types'

const sidebarIcons: Record<SidebarIconName, string> = {
  calendar: calendarIcon,
  megaphone: megaphoneIcon,
  people: peopleIcon,
  storage: storageIcon,
}

export function Sidebar() {
  const { pathname } = useLocation()
  const isOpen = useSidebarStore((state) => state.isOpen)
  const close = useSidebarStore((state) => state.close)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  if (!isOpen) return null

  return (
    <Layer>
      <Overlay type="button" aria-label="사이드바 닫기" onClick={close} />
      <Panel
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="사이드바"
      >
        <CloseButton type="button" aria-label="사이드바 닫기" onClick={close}>
          <CloseIcon src={chevronLeftIcon} alt="" />
        </CloseButton>

        <Profile>
          <Avatar role="img" aria-label={mockSidebarUser.avatarLabel} />
          <UserName>{mockSidebarUser.name}</UserName>
        </Profile>

        <Nav aria-label="주요 메뉴">
          {mockSidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              active={isActiveRoute(pathname, item.to)}
              onClick={close}
            />
          ))}
        </Nav>
      </Panel>
    </Layer>
  )
}

function SidebarItem({
  item,
  active,
  onClick,
}: {
  item: SidebarNavItem
  active: boolean
  onClick: () => void
}) {
  return (
    <NavItem to={item.to} onClick={onClick} $active={active}>
      <ItemIcon src={sidebarIcons[item.icon]} alt="" />
      <ItemLabel>{item.label}</ItemLabel>
    </NavItem>
  )
}

function isActiveRoute(pathname: string, route: string) {
  if (route === '/notices/list') {
    return pathname === route || pathname.startsWith('/notices/list/')
  }

  return pathname === route
}

const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.layout.sidebarZIndex};
`

const Overlay = styled.button`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: ${({ theme }) => theme.colors.overlay};
  cursor: pointer;
`

const Panel = styled.aside`
  position: relative;
  width: ${({ theme }) => theme.layout.sidebarWidth};
  max-width: ${({ theme }) => theme.layout.sidebarMobileWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0 ${({ theme }) => theme.radius.table}
    ${({ theme }) => theme.radius.table} 0;
  box-shadow: ${({ theme }) => theme.layout.sidebarShadow};

  @media (max-width: ${({ theme }) => theme.layout.sidebarMobileBreakpoint}) {
    width: ${({ theme }) => theme.layout.sidebarMobileWidth};
    border-radius: 0;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.layout.sidebarTopPadding};
  left: ${({ theme }) => theme.space.navX};
  display: inline-flex;
  width: ${({ theme }) => theme.layout.sidebarCloseIconSize};
  height: ${({ theme }) => theme.layout.sidebarCloseIconSize};
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`

const CloseIcon = styled.img`
  width: ${({ theme }) => theme.layout.sidebarCloseIconSize};
  height: ${({ theme }) => theme.layout.sidebarCloseIconSize};
`

const Profile = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.layout.sidebarProfileTop};
  left: 0;
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.space.buttonY};
  padding: 0 ${({ theme }) => theme.space.navX};
`

const Avatar = styled.div`
  width: ${({ theme }) => theme.layout.sidebarAvatarSize};
  height: ${({ theme }) => theme.layout.sidebarAvatarSize};
  flex: 0 0 ${({ theme }) => theme.layout.sidebarAvatarSize};
  border-radius: ${({ theme }) => theme.radius.round};
  background: ${({ theme }) => theme.colors.avatar};
`

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.size.sidebarUser};
  font-weight: 500;
  line-height: 1.2;
`

const Nav = styled.nav`
  position: absolute;
  top: ${({ theme }) => theme.layout.sidebarNavTop};
  left: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: calc(
    ${({ theme }) => theme.layout.sidebarItemGap} -
      ${({ theme }) => theme.layout.sidebarItemHeight}
  );
`

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  min-height: ${({ theme }) => theme.layout.sidebarItemHeight};
  align-items: center;
  gap: ${({ theme }) => theme.space.buttonY};
  padding: 0 ${({ theme }) => theme.space.navX};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  text-decoration: none;
`

const ItemIcon = styled.img`
  width: ${({ theme }) => theme.layout.sidebarIconSize};
  height: ${({ theme }) => theme.layout.sidebarIconSize};
  flex: 0 0 ${({ theme }) => theme.layout.sidebarIconSize};
`

const ItemLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.date};
  font-weight: 600;
  line-height: 1.2;
`
