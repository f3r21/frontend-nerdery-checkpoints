import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { fetchUsers, type User } from './api'

/**
 * Server state and UI state are kept apart on purpose: the fetched users are
 * cached and deduped by TanStack Query, while the selection (below) is plain
 * UI state in a context.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // The list never goes stale on its own, so a consumer that unmounts
        // and comes back reads the cache instead of firing a second request.
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  })
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // One client per provider instance rather than a module-level singleton, so
  // the cache lives exactly as long as the provider that owns it.
  const [queryClient] = useState(createQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export function useUsers(): { users: User[]; isLoading: boolean } {
  // Every caller asks for the same key, so the first one starts the request
  // and the rest join it. N consumers, one fetch.
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  })

  return { users: data ?? [], isLoading }
}

// STUB (breaks sharing): selection lives in local component state, so each
// consumer has its OWN selection and siblings never see each other's choice.
export function useSelectedUser(): {
  selectedId: string | null
  select: (id: string) => void
} {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  return { selectedId, select: setSelectedId }
}
