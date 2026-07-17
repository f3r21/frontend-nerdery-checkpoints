import { useId, useState, type FormEvent } from 'react'
import type { NewContact } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm({ onAdd }: { onAdd: (contact: NewContact) => void }) {
  const fieldId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    onAdd({ name: name.trim(), email: email.trim(), role: role.trim() })
    setName('')
    setEmail('')
    setRole('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor={`${fieldId}-name`}>Name</label>
        <input
          id={`${fieldId}-name`}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-email`}>Email</label>
        <input
          id={`${fieldId}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-role`}>Role</label>
        <input
          id={`${fieldId}-role`}
          value={role}
          onChange={(event) => setRole(event.target.value)}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add</button>
    </form>
  )
}
