import type { FormState } from './formState'
import { StatusBanner } from './StatusBanner'
import { useLocalStorageState } from './useLocalStorageState'
import './index.css'

// Runnable demo shown in the dev server: cycle through every FormState variant
// and see how StatusBanner reacts.
const STATES: FormState[] = [
  { status: 'idle' },
  { status: 'submitting' },
  { status: 'success', id: '42' },
  { status: 'error', message: 'Something went wrong' },
]

export default function Demo() {
  const [state, setState] = useLocalStorageState<FormState>('form-status-state', STATES[0])

  return (
    <main className="status-demo">
      <div className="status-demo__inner">
        <header className="status-demo__masthead">
          <h1 className="status-demo__title">Form status</h1>
        </header>
        <div className="status-demo__controls">
          {STATES.map((next) => (
            <button
              key={next.status}
              type="button"
              className="status-demo__control"
              onClick={() => setState(next)}
            >
              {next.status}
            </button>
          ))}
        </div>
        <StatusBanner state={state} />
      </div>
    </main>
  )
}
