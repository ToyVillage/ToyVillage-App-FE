import styled from '@emotion/styled'

interface FileTypeTabsProps {
  types: readonly string[]
  active: string
  onSelect: (type: string) => void
}

export function FileTypeTabs({ types, active, onSelect }: FileTypeTabsProps) {
  return (
    <Tabs>
      {types.map((t) => (
        <Tab
          key={t}
          type="button"
          $active={t === active}
          aria-pressed={t === active}
          onClick={() => onSelect(t)}
        >
          {t}
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
  background: transparent;
  cursor: pointer;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.xl};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.text : 'transparent')};
`
