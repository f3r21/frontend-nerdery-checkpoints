import { useId, useReducer, type FormEvent } from 'react'
import type { NewContact } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormState {
  name: string
  email: string
  role: string
  error: string | null
}

type FormAction =
  | { type: 'set-field'; field: 'name' | 'email' | 'role'; value: string }
  | { type: 'submit-error'; message: string }
  | { type: 'submit-success' }

const initialFormState: FormState = { name: '', email: '', role: '', error: null }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'set-field':
      return { ...state, [action.field]: action.value }
    case 'submit-error':
      return { ...state, error: action.message }
    case 'submit-success':
      return initialFormState
  }
}

export function ContactForm({ onAdd }: { onAdd: (contact: NewContact) => void }) {
  const fieldId = useId()
  const [{ name, email, role, error }, dispatch] = useReducer(formReducer, initialFormState)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      dispatch({ type: 'submit-error', message: 'Name is required.' })
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      dispatch({ type: 'submit-error', message: 'Enter a valid email address.' })
      return
    }

    onAdd({ name: name.trim(), email: email.trim(), role: role.trim() })
    dispatch({ type: 'submit-success' })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={`${fieldId}-name`}>Name</label>
        <input
          id={`${fieldId}-name`}
          value={name}
          onChange={(event) => dispatch({ type: 'set-field', field: 'name', value: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-email`}>Email</label>
        <input
          id={`${fieldId}-email`}
          type="email"
          value={email}
          onChange={(event) => dispatch({ type: 'set-field', field: 'email', value: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-role`}>Role</label>
        <input
          id={`${fieldId}-role`}
          value={role}
          onChange={(event) => dispatch({ type: 'set-field', field: 'role', value: event.target.value })}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add</button>
    </form>
  )
}
