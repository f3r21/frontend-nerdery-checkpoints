import { ContactCard } from './ContactCard'
import type { Contact } from './types'

export function ContactList({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) {
    return <p>No contacts found</p>
  }

  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <ContactCard contact={contact} />
        </li>
      ))}
    </ul>
  )
}
