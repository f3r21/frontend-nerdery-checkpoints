import { createContext, useContext, useId, useMemo, useState, type ReactNode } from 'react'

// The active value lives here and nowhere else. Sub-components read it from
// context, so a consumer composes `Tabs.List` / `Tabs.Tab` / `Tabs.Panel` in
// any arrangement without threading `active`/`onChange` through the tree.
// `baseId` rides along so a tab and its panel can derive the same pair of ids
// and point at each other without the consumer supplying any.
interface TabsContextValue {
  value: string
  select: (value: string) => void
  baseId: string
}

const tabIdFor = (baseId: string, value: string) => `${baseId}-tab-${value}`
const panelIdFor = (baseId: string, value: string) => `${baseId}-panel-${value}`

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
  const baseId = useId()

  const context: TabsContextValue = useMemo(
    () => ({ value, select: setValue, baseId }),
    [value, baseId],
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
  const { value: activeValue, select, baseId } = useTabsContext()
  const isSelected = value === activeValue

  return (
    <button
      type="button"
      role="tab"
      id={tabIdFor(baseId, value)}
      // Only the selected tab points at a panel: the other panels are not
      // rendered, so their ids would be dangling references.
      aria-controls={isSelected ? panelIdFor(baseId, value) : undefined}
      aria-selected={isSelected}
      onClick={() => select(value)}
    >
      {children}
    </button>
  )
}

interface TabsPanelProps {
  value: string
  children: ReactNode
}

function TabsPanel({ value, children }: TabsPanelProps) {
  const { value: activeValue, baseId } = useTabsContext()

  // Inactive panels are not rendered at all, so exactly one tabpanel is ever
  // in the accessibility tree.
  if (value !== activeValue) {
    return null
  }

  return (
    <div
      role="tabpanel"
      id={panelIdFor(baseId, value)}
      aria-labelledby={tabIdFor(baseId, value)}
      // The panel may hold nothing focusable, so it takes focus itself and
      // Tab from the selected tab lands on the content it describes.
      tabIndex={0}
    >
      {children}
    </div>
  )
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
})
