import styled from '@emotion/styled'

interface CategoryTabsProps {
  categories: string[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <Tabs>
      {categories.map((c) => (
        <Tab
          key={c}
          type="button"
          $active={c === active}
          aria-pressed={c === active}
          onClick={() => onSelect(c)}
        >
          {c}
        </Tab>
      ))}
    </Tabs>
  )
}

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`

const Tab = styled.button<{ $active: boolean }>`
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-weight: 600;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryBg : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textMuted};
`
