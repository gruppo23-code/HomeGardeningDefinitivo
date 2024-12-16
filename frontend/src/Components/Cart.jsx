import React from 'react';
import { X, Trash2 } from 'lucide-react';

const Cart = ({ buy,cart, removeFromCart, clearCart, closeCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="cart-popup" style={{ fontFamily: "var(--font-family), 'Roboto', sans-serif" }}>
            <div className="cart-header">
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Carrello</h2>
                <button onClick={closeCart} className="close-cart">
                    <X size={28} />
                </button>
            </div>
            {cart.length === 0 ? (
                <p style={{ fontSize: '1.1rem', fontWeight: 400 }}>Il tuo carrello è vuoto</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div style={{ flex: 1, marginRight: '15px' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 500, display: 'block', marginBottom: '5px' }}>{item.name}</span>
                                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#4CAF50' }}>€{item.price.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    transition: 'color 0.3s ease',
                                    color: '#000000'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#e74c3c'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <div className="cart-total" style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                        <strong style={{ fontSize: '1.3rem', fontWeight: 600 }}>Totale: €{total.toFixed(2)}</strong>
                    </div>
                    <button className="checkout-button" onClick={buy} style={{
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        marginTop: '15px',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Procedi all'acquisto
                    </button>
                    <button className="clear-cart-button" onClick={clearCart} style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        marginTop: '10px',
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Trash2 size={22} style={{ marginRight: '8px' }} />
                        Rimuovi tutto
                    </button>
                </>
            )}
        </div>
    );
};

export default Cart;

