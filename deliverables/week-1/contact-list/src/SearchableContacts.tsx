import { useId, useState } from 'react'
import { ContactForm } from './ContactForm'
import { ContactList } from './ContactList'
import { initialContacts, type Contact, type NewContact } from './types'

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function SearchableContacts() {
  const searchId = useId()
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const visibleContacts = normalizedQuery
    ? contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(normalizedQuery) ||
          contact.email.toLowerCase().includes(normalizedQuery),
      )
    : contacts

  function handleAdd(contact: NewContact) {
    setContacts((prev) => [...prev, { id: createId(), ...contact }])
  }

  return (
    <section>
      <div>
        <label htmlFor={searchId}>Search contacts</label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <ContactList contacts={visibleContacts} />
      <ContactForm onAdd={handleAdd} />
    </section>
  )
}
