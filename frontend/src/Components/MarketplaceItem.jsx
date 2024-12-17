import React from 'react';
import Cookies from "js-cookie";

const MarketplaceItem = ({ item, addToCart }) => {

    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token;
    };

    const alertClick = () => {
        alert("Accesso Negato. Devi essere loggato per accedere alla Dashboard.");
    };

    return (
        <div className="marketplace-item">
            <img src={item.imageUrl} alt={item.name}/>
            <h3>{item.name}</h3>
            <p>Utente: {item.user}</p>
            <p>Tipo: {item.type}</p>
            <p>Prezzo: €{item.price.toFixed(2)}</p>
            {isLoggedIn() ? (
                <button onClick={() => addToCart(item)}>Aggiungi al carrello</button>
            ) : (
                <button onClick={alertClick}>Aggiungi al carrello</button>
            )}

        </div>
    );
};

export default MarketplaceItem;

