import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// The active value lives here and nowhere else. Sub-components read it from
// context, so a consumer composes `Tabs.List` / `Tabs.Tab` / `Tabs.Panel` in
// any arrangement without threading `active`/`onChange` through the tree.
interface TabsContextValue {
  value: string
  select: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context === null) {
    throw new Error('Tabs.List, Tabs.Tab and Tabs.Panel must be used within <Tabs>')
  }
  return context
}

interface TabsProps {
  defaultValue: string
  children: ReactNode
}

function TabsRoot({ defaultValue, children }: TabsProps) {
  const [value, setValue] = useState(defaultValue)

  const context: TabsContextValue = useMemo(
    () => ({ value, select: setValue }),
    [value],
  )

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
}

interface TabsListProps {
  children: ReactNode
}

function TabsList({ children }: TabsListProps) {
  // Nothing from context is needed here yet; the call is the guard, so a
  // tablist rendered outside <Tabs> fails as loudly as its tabs would.
  useTabsContext()

  return <div role="tablist">{children}</div>
}

interface TabProps {
  value: string
  children: ReactNode
}

function Tab({ value, children }: TabProps) {
  const { value: activeValue, select } = useTabsContext()
  const isSelected = value === activeValue

  return (
    <button type="button" role="tab" aria-selected={isSelected} onClick={() => select(value)}>
      {children}
    </button>
  )
}

interface TabsPanelProps {
  value: string
  children: ReactNode
}

function TabsPanel({ value, children }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext()

  // Inactive panels are not rendered at all, so exactly one tabpanel is ever
  // in the accessibility tree.
  if (value !== activeValue) {
    return null
  }

  return <div role="tabpanel">{children}</div>
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
})
