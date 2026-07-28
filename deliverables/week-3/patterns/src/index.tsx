import { createTabs } from './Tabs'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'
import './index.css'

// Its own T instead of the default (plain string) Tabs export: overview /
// specs / reviews is a fixed, known set for this demo, so a typo'd value on
// Tabs.Tab or Tabs.Panel becomes a compile error instead of a silent no-op.
// Its own storage key too, so this instance never collides with the
// default Tabs export's if that one's ever rendered on the same page.
const Tabs = createTabs<'overview' | 'specs' | 'reviews'>('patterns-active-tab')

export default function Demo() {
  return (
    <ThemeProvider>
      <div className="tabs-demo">
        <div className="tabs-demo__inner">
          <header className="tabs-demo__masthead">
            <h1 className="tabs-demo__title">W3 · Patterns — Compound Tabs</h1>
            <ThemeToggle />
          </header>
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="specs">Specs</Tabs.Tab>
              <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview">
              <p>A compound component composed without prop drilling.</p>
            </Tabs.Panel>
            <Tabs.Panel value="specs">
              <p>Active tab state lives in React context, shared by sub-components.</p>
            </Tabs.Panel>
            <Tabs.Panel value="reviews">
              <p>Consumers just compose Tabs.List / Tabs.Tab / Tabs.Panel.</p>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  )
}
