import { useEffect, useId, useRef, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

export function DebouncedSearch() {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 300)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div>
      <label htmlFor={id}>Search</label>
      <input
        id={id}
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p>Searching: {debounced}</p>
    </div>
  )
}
