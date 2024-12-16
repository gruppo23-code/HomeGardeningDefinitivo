import React, { useState, useEffect } from 'react';
import MarketplaceItem from '../Components/MarketplaceItem';
import SearchBar from '../Components/SearchBar';
import Cart from '../Components/Cart';
import AddProductPopup from '../Components/AddProductPopup';
import { ShoppingCart, PlusCircle } from 'lucide-react';
import '../pages/css/marketplace.css';
import axios from "axios";
import defaultImage from "../assets/img/pianta_stilizzata.jpg";

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8081/listaannunci')
        .then(res => {
            const tempAnnunci = res.data.map(ann => {
                if (ann.img) {
                    // Converti il buffer in base64
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(ann.img.data)));
                    const imageUrl = `data:image/jpg;base64,${base64String}`;
                    return { ...ann, imageUrl };
                }
                return { ...ann, imageUrl: "https://via.placeholder.com/200?text="+ann.name+"+"+ann.type }; // Usa l'immagine predefinita se non c'è immagine
            });
            setItems(tempAnnunci);
            setFilteredItems(tempAnnunci);
        })
    }, []);

    useEffect(() => {
        const results = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterType === 'all' || item.type === filterType)
        );
        setFilteredItems(results);
    }, [searchTerm, filterType, items]);

    const addToCart = (item) => {
        axios.post('http://localhost:8081/aggiungicarrello', {id: item.id})
            .then(res => {
                console.log("Aggiunta al carrello effettuata con successo!!!");
            })
            .catch(err => {
                console.log(err);
            })
    };

    const removeFromCart = (itemId) => {
        axios.post('http://localhost:8081/rimuoviarticolo', {id: itemId})
            .then(res => {
                console.log("Rimozione articolo effettuata con successo!!!");
            })
            .catch(err => {
                console.log(err);
            })
    };

    const clearCart = () => {
        axios.post('http://localhost:8081/cancellacarrello')
            .then(res => {
                //console.log("Carrello ripulito correttamente!!!");
            })
            .catch(err => {
                console.log(err);
            })
    };

    //Funzione per la gestione dell'acquisto (simulazione)
    const [tempCart, setTempCart] = useState([]);
    const buy = () => {
        axios.get('http://localhost:8081/visualizzacarrello') //Prendo i dati degli oggetti nel carrello
            .then(res => {
                setTempCart(res.data);
            })
            .catch(err => {
                console.log(err);
            })

        axios.post("http://localhost:8081/acquisto",tempCart) //Registro l'acquisto
            .then(res => {
                console.log("Acquisto effettuato con successo!!!");
            })
            .catch(err => {
                console.log(err);
            })

        //clearCart();
    }

    useEffect(() => {
        axios.get('http://localhost:8081/visualizzacarrello')
            .then(res => {
                setCart(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    },[isCartOpen,addToCart,removeFromCart,clearCart,buy]);


    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleAddProduct = (newProduct) => { //Gestione aggiungi prodotto
        axios.post('http://localhost:8081/aggiungiannuncio', newProduct,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    };

    return (
        <div className="marketplace">
            <h1>Home Gardening Marketplace</h1>
            <p>Trova tutto ciò di cui hai bisogno per il tuo giardino domestico!</p>
            <div className="marketplace-header">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterType={filterType}
                    setFilterType={setFilterType}
                />
                <div className="header-actions">
                    <button className="add-product-btn" onClick={() => setIsAddProductOpen(true)}>
                        <PlusCircle size={24} />
                        <span>Aggiungi Prodotto</span>
                    </button>
                    <div className="cart-icon" onClick={toggleCart}>
                        <ShoppingCart size={24} />
                        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                    </div>
                </div>
            </div>
            <div className="marketplace-layout">
                <div className="marketplace-grid">
                    {filteredItems.map(item => (
                        <MarketplaceItem key={item.id} item={item} addToCart={addToCart} />
                    ))}
                </div>
            </div>
            {isCartOpen && (
                <Cart
                    buy={buy}
                    cart={cart}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                    closeCart={() => setIsCartOpen(false)}
                />
            )}
            <AddProductPopup
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onAddProduct={handleAddProduct}
            />
        </div>
    );
};

export default Marketplace;

