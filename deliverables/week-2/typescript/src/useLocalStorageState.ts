import { useCallback, useState } from 'react'

// A reusable GENERIC hook. `<T>` lets it store any shape (number, object, …)
// while keeping the value and setter fully typed at each call site.
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setState] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      return JSON.parse(stored) as T
    }
    return initialValue
  })

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved = next instanceof Function ? next(prev) : next
        localStorage.setItem(key, JSON.stringify(resolved))
        return resolved
      })
    },
    [key],
  )

  return [value, setValue]
}
