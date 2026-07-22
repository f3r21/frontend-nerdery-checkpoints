import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { TodoApp } from './src/TodoApp'

async function addTodo(user: UserEvent, text: string) {
  await user.type(screen.getByLabelText(/new todo/i), text)
  await user.click(screen.getByRole('button', { name: 'Add' }))
}

describe('TodoApp', () => {
  // Starter smoke test — this one already passes. Leave it or improve it.
  it('renders the new-todo input', () => {
    render(<TodoApp />)
    expect(screen.getByLabelText(/new todo/i)).toBeInTheDocument()
  })

  it('adds a non-empty todo to the list', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await addTodo(user, 'Buy milk')

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeInTheDocument()
  })

  it('ignores empty and whitespace-only input', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await addTodo(user, '   ')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('clears the input after adding', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await addTodo(user, 'Buy milk')

    expect(screen.getByLabelText(/new todo/i)).toHaveValue('')
  })

  it.todo('toggles a todo completed via its checkbox')
  it.todo('deletes a todo via its Delete button')
  it.todo('Active filter shows only not-completed todos')
  it.todo('Completed filter shows only completed todos')
  it.todo('All filter shows every todo again')
  it.todo('shows the count of active todos as "{n} left"')
})
