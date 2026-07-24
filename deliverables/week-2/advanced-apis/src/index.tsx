import { CartProvider } from './CartContext'
import { Cart } from './Cart'
import './index.css'

// Runnable demo shown in the dev server.
export default function Demo() {
  return (
    <main className="cart-demo">
      <div className="cart-demo__inner">
        <header className="cart-demo__masthead">
          <h1 className="cart-demo__title">Shopping Cart</h1>
        </header>
        <CartProvider>
          <Cart />
        </CartProvider>
      </div>
    </main>
  )
}
