import styled from '@emotion/styled'

interface CategoryTabsProps {
  categories: string[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryTabs({
  categories,
  active,
  onSelect,
}: CategoryTabsProps) {
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
  width: 100%;
  margin-top: ${({ theme }) => theme.layout.tabOffset};
`

const Tab = styled.button<{ $active: boolean }>`
  border: 0;
  border-bottom: ${({ $active, theme }) =>
    $active
      ? `${theme.space.xs} solid ${theme.colors.text}`
      : `${theme.space.xs} solid transparent`};
  cursor: pointer;
  padding: ${({ theme }) => theme.space.controlY}
    ${({ theme }) => theme.space.tableX};
  font-weight: 600;
  font-size: ${({ theme }) => theme.font.size.date};
  line-height: 1.2;
  background: transparent;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};

  &[aria-pressed='false'] {
    font-size: ${({ theme }) => theme.font.size.tableHeader};
    font-weight: 500;
  }
`
