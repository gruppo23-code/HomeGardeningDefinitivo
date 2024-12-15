import React from 'react';

const MarketplaceItem = ({ item, addToCart }) => {
    return (
        <div className="marketplace-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Tipo: {item.type}</p>
            <p>Prezzo: €{item.price.toFixed(2)}</p>
            <button onClick={() => addToCart(item)}>Aggiungi al carrello</button>
        </div>
    );
};

export default MarketplaceItem;

