import { useLayoutEffect, useRef } from 'react'
import { useCart } from './CartContext'

// Sample products the demo can add to the cart. Integer prices keep the
// displayed total easy to read and assert against.
const SAMPLE_PRODUCTS = [
  { id: 'coffee', name: 'Coffee', price: 10 },
  { id: 'bagel', name: 'Bagel', price: 5 },
] as const

export function Cart() {
  const { state, total, add, remove, setQty, clear } = useCart()
  const firstAddButtonRef = useRef<HTMLButtonElement>(null)
  const previousItemCount = useRef(state.items.length)

  // Remove / clear / setQty→0 can unmount whatever element currently holds
  // focus, which drops it to <body>. When the item count just dropped, send
  // focus back to a control that's guaranteed to still exist rather than
  // leaving it lost. Comparing counts (rather than a "first render" flag)
  // keeps this correct under StrictMode's dev-only double effect
  // invocation on mount, which would otherwise re-arm a flag-based guard.
  useLayoutEffect(() => {
    const shrank = state.items.length < previousItemCount.current
    previousItemCount.current = state.items.length
    if (shrank && document.activeElement === document.body) {
      firstAddButtonRef.current?.focus()
    }
  }, [state.items])

  return (
    <section aria-label="Shopping cart">
      <h2>Cart</h2>

      <div>
        {SAMPLE_PRODUCTS.map((product, index) => (
          <button
            key={product.id}
            type="button"
            ref={index === 0 ? firstAddButtonRef : undefined}
            onClick={() => add(product)}
          >
            Add {product.name} (${product.price})
          </button>
        ))}
      </div>

      {state.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {state.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} — ${item.price} × {item.qty}
              </span>
              <span style={{ margin: '0 0.5rem' }}>
                <button
                  type="button"
                  aria-label={`Decrease quantity for ${item.name}`}
                  onClick={() => setQty(item.id, item.qty - 1)}
                >
                  -
                </button>{' '}
                <span aria-live="polite">{item.qty}</span>{' '}
                <button
                  type="button"
                  aria-label={`Increase quantity for ${item.name}`}
                  onClick={() => setQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </span>
              <button type="button" onClick={() => remove(item.id)}>
                Remove {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p data-testid="cart-total">Total: ${total}</p>

      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  )
}
