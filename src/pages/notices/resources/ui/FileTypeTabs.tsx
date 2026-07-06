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
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};

  &[aria-pressed='false'] {
    font-size: ${({ theme }) => theme.font.size.tableHeader};
    font-weight: 500;
  }
`
