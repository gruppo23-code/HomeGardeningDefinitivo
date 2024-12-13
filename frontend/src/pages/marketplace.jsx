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
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/pianta-arachidi_NG1.jpg",
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
            image: "https://www.lombardaflor.it/wp-content/uploads/2018/03/Gossypium-come-coltivare-la-pianta-del-cotone-in-vaso.jpg",
        },
        {
            id: 4,
            name: "Terrario in Vetro",
            description: "Terrario elegante in vetro, ideale per piante tropicali.",
            price: 45,
            condition: "Ottime Condizioni",
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/pianta-arachidi_NG1.jpg",
        },
        {
            id: 5,
            name: "Compostiera da Giardino",
            description: "Compostiera in legno per il riciclo dei rifiuti organici.",
            price: 70,
            condition: "Nuovo",
            image: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c0/98/66/c09866bc-427d-90cb-3093-f12760918f73/artwork.jpg/600x600bf-60.jpg",
        },
        {
            id: 6,
            name: "Piante Aromatiche",
            description: "Set di piante aromatiche fresche per la cucina.",
            price: 20,
            condition: "Nuovo",
            image: "https://www.lombardaflor.it/wp-content/uploads/2018/03/Gossypium-come-coltivare-la-pianta-del-cotone-in-vaso.jpg",
        },
        {
            id: 7,
            name: "Cesto per Piante",
            description: "Cesto in vimini per piante, perfetto per decorare.",
            price: 15,
            condition: "Buone Condizioni",
            image: "https://www.giardinaggio.net/frutti/alberi-da-frutto/pianta-arachidi_NG1.jpg",
        },
    ]);

    return (
        <div className="marketplace-container">
            <h1>Marketplace di Giardinaggio</h1>

            <div className="add-item">
                <button className="add-button">Aggiungi Articolo</button>
            </div>

            <div className="items-container">
                {items.map((item) => (
                    <div key={item.id} className="item-card">
                        <img src={item.image} alt={item.name} className="item-image" />
                        <div className="item-content">
                            <h2 className="item-name">{item.name}</h2>
                            <p className="item-description">{item.description}</p>
                            <p className="item-price">€{item.price}</p>
                            <span className="condition">{item.condition}</span>
                            <div className="buttons">
                                <button className="trade-button">Proponi Scambio</button>
                                <button className="buy-button">Acquista</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;