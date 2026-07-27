import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

interface SelectionApi {
  selectedId: string | null
  select: (id: string) => void
}

const SelectionContext = createContext<SelectionApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  // One client per provider instance rather than a module-level singleton, so
  // the cache lives exactly as long as the provider that owns it.
  const [queryClient] = useState(createQueryClient)

  // The one and only selection. It lives here, above both consumers, which is
  // what lets a sibling see a choice made somewhere else in the tree.
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selection: SelectionApi = useMemo(
    () => ({ selectedId, select: setSelectedId }),
    [selectedId],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>
    </QueryClientProvider>
  )
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

export function useSelectedUser(): SelectionApi {
  const selection = useContext(SelectionContext)
  if (selection === null) {
    throw new Error('useSelectedUser must be used within an AppStateProvider')
  }
  return selection
}
