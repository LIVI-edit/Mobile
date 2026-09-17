import { useCart } from '../context/CartContext.jsx';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

function ProductImage({ product }) {
  return (
    <div className="cart-product__visual" aria-hidden="true">
      <span className="cart-product__placeholder">□</span>
      {product.image ? (
        <img
          className="cart-product__image"
          src={product.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
}

export default function CartView() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  return (
    <div className="cart-view">
      <div className="cart-view__content">
        <header className="cart-view__header">
          <p>Your selection</p>
          <h1>Cart</h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <strong>Your cart is empty</strong>
            <p>Products selected by AISA will appear here.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => {
                const { product, quantity, lineTotal } = item;
                return (
                  <li className="cart-product" key={product.id}>
                    <ProductImage product={product} />
                    <div className="cart-product__info">
                      <strong>{product.name}</strong>
                      <span>{formatPrice(product.price)} · {product.packageSize || product.unit || '1 pc'}</span>
                    </div>
                    <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
                      <button type="button" onClick={() => decreaseQuantity(product.id)} aria-label="Decrease quantity">−</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => increaseQuantity(product.id)} aria-label="Increase quantity">+</button>
                    </div>
                    <div className="cart-product__total">
                      <strong>{formatPrice(lineTotal)}</strong>
                      <button type="button" onClick={() => removeFromCart(product.id)}>Remove</button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Total</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <button className="clear-button" type="button" onClick={clearCart}>Clear cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
