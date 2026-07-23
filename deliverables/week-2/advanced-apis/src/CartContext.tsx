import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { cartReducer, initialCart, selectTotal, type CartState } from './cartReducer'

export interface CartApi {
  state: CartState
  total: number
  add: (item: { id: string; name: string; price: number }) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)

  const value: CartApi = useMemo(() => ({
    state,
    total: selectTotal(state),
    add: (item) => dispatch({ type: 'add', item }),
    remove: (id) => dispatch({ type: 'remove', id }),
    setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
    clear: () => dispatch({ type: 'clear' }),
  }), [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartApi {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return value
}
