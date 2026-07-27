import { Suspense, use } from 'react'
import { fetchUsers, type User } from './api'

/**
 * One request, cached at module level. The first render that needs the users
 * starts it and every render after reuses the same promise, so re-rendering
 * the subtree never kicks off a second fetch. Initialising lazily rather than
 * at import time keeps a module that is imported but never rendered from
 * hitting the network at all.
 */
let usersPromise: Promise<User[]> | null = null

function getUsers(): Promise<User[]> {
  usersPromise ??= fetchUsers()
  return usersPromise
}

function UserList() {
  // `use` unwraps the cached promise: it suspends to the boundary below while
  // the request is pending, and re-throws on rejection.
  const users = use(getUsers())

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

export function UsersView() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <UserList />
    </Suspense>
  )
}
