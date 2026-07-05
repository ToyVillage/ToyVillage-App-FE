export type SidebarIconName = 'calendar' | 'megaphone' | 'people' | 'storage'

export interface SidebarUser {
  name: string
  avatarLabel: string
}

export interface SidebarNavItem {
  id: string
  label: string
  to: string
  icon: SidebarIconName
}
