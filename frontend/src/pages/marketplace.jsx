import React, { useState } from "react";
import './css/marketplace.css';
import Cookies from "js-cookie";
import {Link} from "react-router-dom";

function Marketplace() {
    const [searchTerm, setSearchTerm] = useState("");

    const items = [
        {
            id: 1,
            name: 'Pianta di Aloe Vera',
            description: 'Una pianta succulenta facile da curare.',
            price: 10,
            image: 'https://example.com/aloe-vera.jpg' // Sostituisci con un URL reale
        },
        {
            id: 2,
            name: 'Semi di Pomodoro',
            description: 'Semi di pomodoro biologici.',
            price: 5,
            image: 'https://example.com/semi-pomodoro.jpg' // Sostituisci con un URL reale
        },
        {
            id: 3,
            name: 'Attrezzo da Giardinaggio',
            description: 'Un attrezzo versatile per il giardinaggio.',
            price: 15,
            image: 'https://example.com/attrezzo-giardinaggio.jpg' // Sostituisci con un URL reale
        },
        {
            id: 4,
            name: 'Pianta di Lavanda',
            description: 'Una pianta profumata e decorativa.',
            price: 12,
            image: 'https://example.com/lavanda.jpg' // Sostituisci con un URL reale
        },
        {
            id: 5,
            name: 'Vaso Decorativo',
            description: 'Un vaso elegante per le tue piante.',
            price: 8,
            image: 'https://example.com/vaso-decorativo.jpg' // Sostituisci con un URL reale
        }
    ];

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isLoggedIn = () => {
        const token = Cookies.get('token'); // Sostituisci 'token' con il nome del tuo cookie
        return !!token; // Ritorna true se il token esiste, false altrimenti
    };

    const alertClick = () => {
        alert("Accesso Negato. Devi essere loggato per fare acquisti.");
    };

    return (
        <div className="marketplace mt-3 mb-3">
            <div className="container m-0">
                sas
            </div>
            <h1>Marketplace di Giardinaggio</h1>
            <div className="search-container">
                <input type="text" className="search-input" placeholder="Cerca..."/>
                <button className="search-button">
                    🔍
                </button>
            </div>
            <div className="item-list">
            {filteredItems.map(item => (
                <div key={item.id} className="item">
                    <img src={item.image} alt={item.name} className="item-image"/>
                    <h2>{item.name}</h2>
                    <p className="item-description">{item.description}</p>
                    <p className="item-price">Prezzo: {item.price}€</p>
                    {isLoggedIn() ? (
                        <button className="buy-button">Acquista</button>
                    ) : (
                        <button className="buy-button" onClick={alertClick}>Acquista</button>
            )}
            </div>
            ))}
            </div>
        </div>
    );
}

export default Marketplace;