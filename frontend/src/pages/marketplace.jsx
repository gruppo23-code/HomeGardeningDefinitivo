// /src/Marketplace.js
import React, { useState } from "react";
import "./css/marketplace.css";

const Marketplace = () => {
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Vaso di Terracotta Vintage",
            description: "Vaso antico in terracotta, perfetto per piante grasse",
            price: 25,
            condition: "Ottime Condizioni",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c0/98/66/c09866bc-427d-90cb-3093-f12760918f73/artwork.jpg/600x600bf-60.jpg",
        },
        {
            id: 2,
            name: "Set di Attrezzi da Giardinaggio",
            description: "Set completo di 5 attrezzi in acciaio inossidabile",
            price: 50,
            condition: "Nuovo",
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/pianta-arachidi_NG1.jpg",
        },
        {
            id: 3,
            name: "Piante Grasse Variegate",
            description: "Collezione di piante grasse variegate, facili da curare.",
            price: 30,
            condition: "Nuovo",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO0vXm_7wMo9jQB99OcHRjvghHfQAk0hRAXg&s",
        },
        {
            id: 4,
            name: "Terrario in Vetro",
            description: "Terrario elegante in vetro, ideale per piante tropicali.",
            price: 45,
            condition: "Ottime Condizioni",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d9/19/22/d919224f-fa3c-3412-30f6-353f87641d9a/artwork.jpg/1200x1200bb.jpg",
        },
        {
            id: 5,
            name: "Compostiera da Giardino",
            description: "Compostiera in legno per il riciclo dei rifiuti organici.",
            price: 70,
            condition: "Nuovo",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5a/61/df/5a61df79-a03c-d81f-afb2-04de3e243b25/artwork.jpg/1200x1200bb.jpg",
        },
        {
            id: 6,
            name: "Piante Aromatiche",
            description: "Set di piante aromatiche fresche per la cucina.",
            price: 20,
            condition: "Nuovo",
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/piante-aromatiche.jpg",
        },
        {
            id: 7,
            name: "Cesto per Piante",
            description: "Cesto in vimini per piante, perfetto per decorare.",
            price: 15,
            condition: "Buone Condizioni",
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/cesto-piante.jpg",
        },
        {
            id: 8,
            name: "Fioriera in Legno",
            description: "Fioriera in legno per il tuo giardino.",
            price: 35,
            condition: "Nuovo",
            image: "https://example.com/fioriera.jpg",
        },
        {
            id: 9,
            name: "Piante da Interno",
            description: "Piante da interno per abbellire la tua casa.",
            price: 40,
            condition: "Nuovo",
            image: "https://example.com/piante-interno.jpg",
        },
        {
            id: 10,
            name: "Vasi Decorativi",
            description: "Vasi decorativi per ogni ambiente.",
            price: 20,
            condition: "Nuovo",
            image: "https://example.com/vasi-decorativi.jpg",
        },
    ]);

    return (
        <div className="marketplace-container">
            <h1>Marketplace di Giardinaggio</h1>

            <div className="search-container">
                <input type="text" className="search-input" placeholder="Cerca..." />
                <button className="search-button">
                    <i className="fas fa-search"></i> {/* Icona della lente di ingrandimento */}
                </button>
                <button className="add-item-button">Aggiungi Oggetto</button> {/* Pulsante Aggiungi Oggetto */}
            </div>

            <div className="items-container">
                {items.map((item) => (
                    <div key={item.id} className="item-card">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-content">
                            <h2 className="item-name">{item.name}</h2>
                            <p className="item-description">{item.description}</p>
                            <p className="item-price">€{item.price}</p>
                            <p className="condition">{item.condition}</p>
                            <div className="buttons">
                                <button className="trade-button">Scambia</button>
                                <button className="buy-button">Compra</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;