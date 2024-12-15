import React from 'react';
import { X } from 'lucide-react';

const Cart = ({ cart, removeFromCart, closeCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="cart-popup">
            <div className="cart-header">
                <h2>Carrello</h2>
                <button onClick={closeCart} className="close-cart">
                    <X size={24} />
                </button>
            </div>
            {cart.length === 0 ? (
                <p>Il tuo carrello è vuoto</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <span>{item.name} - €{item.price.toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.id)}>Rimuovi</button>
                        </div>
                    ))}
                    <div className="cart-total">
                        <strong>Totale: €{total.toFixed(2)}</strong>
                    </div>
                    <button className="checkout-button">Procedi all'acquisto</button>
                </>
            )}
        </div>
    );
};

export default Cart;

