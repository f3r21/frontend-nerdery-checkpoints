import { useEffect, useId, useRef, useState } from 'react'
import { ContactForm } from './ContactForm'
import { ContactList } from './ContactList'
import { FieldLabel } from './FieldLabel'
import { initialContacts, type Contact, type NewContact } from './types'
import { useDebouncedValue } from '../../interactivity/src/useDebouncedValue'
import { useLocalStorageState } from '../../interactivity/src/useLocalStorageState'
import './SearchableContacts.css'

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function SearchableContacts() {
  const searchId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const [contacts, setContacts] = useLocalStorageState<Contact[]>('contacts', initialContacts)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const normalizedQuery = debouncedQuery.trim().toLowerCase()
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
    <section className="contacts">
      <div className="contacts__search">
        <FieldLabel htmlFor={searchId}>Search contacts</FieldLabel>
        <input
          className="contacts__input"
          id={searchId}
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="contacts__body">
        <div className="contacts__directory">
          <p className="contacts__count">
            <span className="contacts__count-value">
              {String(visibleContacts.length).padStart(2, '0')}
            </span>
            <span className="contacts__count-label">shown</span>
          </p>
          <ContactList contacts={visibleContacts} />
        </div>
        <ContactForm onAdd={handleAdd} />
      </div>
    </section>
  )
}
