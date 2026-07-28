import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import './Tabs.css'

// The active value lives here and nowhere else. Sub-components read it from
// context, so a consumer composes `Tabs.List` / `Tabs.Tab` / `Tabs.Panel` in
// any arrangement without threading `active`/`onChange` through the tree.
// `baseId` rides along so a tab and its panel can derive the same pair of ids
// and point at each other without the consumer supplying any.
interface TabsContextValue {
  value: string
  select: (value: string) => void
  baseId: string
  defaultValue: string
}

const tabIdFor = (baseId: string, value: string) => `${baseId}-tab-${value}`
const panelIdFor = (baseId: string, value: string) => `${baseId}-panel-${value}`

// One shared slot for the whole page, same as ThemeProvider's 'theme' key.
// A second <Tabs> rendered alongside this one would share it too, which
// doesn't happen in this demo.
const STORAGE_KEY = 'patterns-active-tab'

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
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? defaultValue
    } catch (e) {
      console.error('Tabs: failed to read persisted tab:', e)
      return defaultValue
    }
  })
  const baseId = useId()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch (e) {
      console.error('Tabs: failed to persist tab:', e)
    }
  }, [value])

  const context: TabsContextValue = useMemo(
    () => ({ value, select: setValue, baseId, defaultValue }),
    [value, baseId, defaultValue],
  )

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
}

interface TabsListProps {
  children: ReactNode
}

// Where the arrow keys land, or null for a key the tablist doesn't handle.
// Both arrows wrap around the ends.
function nextTabIndex(key: string, current: number, last: number): number | null {
  switch (key) {
    case 'ArrowRight':
      return current === last ? 0 : current + 1
    case 'ArrowLeft':
      return current === 0 ? last : current - 1
    case 'Home':
      return 0
    case 'End':
      return last
    default:
      return null
  }
}

function TabsList({ children }: TabsListProps) {
  const { defaultValue, select } = useTabsContext()
  const listRef = useRef<HTMLDivElement>(null)

  // A persisted active value that no longer matches any rendered tab (e.g.
  // a value was renamed since it was saved) would otherwise leave every tab
  // unselected and every panel unrendered. Runs before paint, once, so an
  // orphaned value never has a chance to flash with nothing selected.
  useLayoutEffect(() => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    const hasSelection = Array.from(tabs).some(
      (tab) => tab.getAttribute('aria-selected') === 'true',
    )
    if (!hasSelection && tabs.length > 0) {
      select(defaultValue)
    }
  }, [defaultValue, select])

  // The APG keyboard contract, with manual activation: arrows and Home/End
  // move focus, and the tab is a real button so Enter/Space already activate
  // it. Moving focus without selecting keeps arrowing through the tabs from
  // swapping the panel out from under someone still looking for the one they
  // want. Tabs are read back out of the DOM rather than tracked in a
  // registry, so they stay in visual order however the consumer nests them.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    )
    const current = tabs.findIndex((tab) => tab === document.activeElement)
    if (current === -1) {
      return
    }

    const next = nextTabIndex(event.key, current, tabs.length - 1)
    if (next === null) {
      return
    }

    // Stop Home/End scrolling the page and the arrows moving the caret.
    event.preventDefault()
    tabs[next].focus()
  }

  return (
    <div className="tabs__list" role="tablist" ref={listRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
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
      className="tabs__tab"
      type="button"
      role="tab"
      id={tabIdFor(baseId, value)}
      // Only the selected tab points at a panel: the other panels are not
      // rendered, so their ids would be dangling references.
      aria-controls={isSelected ? panelIdFor(baseId, value) : undefined}
      aria-selected={isSelected}
      // Roving tabindex: the tablist is one stop, so Tab reaches the selected
      // tab and then moves on to its panel instead of walking every tab.
      tabIndex={isSelected ? 0 : -1}
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
      className="tabs__panel"
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
