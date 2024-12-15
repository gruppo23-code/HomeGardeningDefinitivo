import React, { useState, useEffect } from 'react';
import MarketplaceItem from '../Components/MarketplaceItem';
import SearchBar from '../Components/SearchBar';
import Cart from '../Components/Cart';
import AddProductPopup from '../Components/AddProductPopup';
import { ShoppingCart, PlusCircle } from 'lucide-react';
import '../pages/css/marketplace.css';

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);

    useEffect(() => {
        // Simulazione di una chiamata API
        const sampleItems = [
            { id: 1, name: 'Semi di pomodoro', type: 'seeds', price: 2.99, image: 'https://via.placeholder.com/200?text=Tomato+Seeds' },
            { id: 2, name: 'Annaffiatoio', type: 'tool', price: 15.99, image: 'https://via.placeholder.com/200?text=Watering+Can' },
            { id: 3, name: 'Pianta di basilico', type: 'plant', price: 5.99, image: 'https://via.placeholder.com/200?text=Basil+Plant' },
            { id: 4, name: 'Guanti da giardinaggio', type: 'tool', price: 8.99, image: 'https://via.placeholder.com/200?text=Gardening+Gloves' },
            { id: 5, name: 'Semi di lavanda', type: 'seeds', price: 3.99, image: 'https://via.placeholder.com/200?text=Lavender+Seeds' },
            { id: 6, name: 'Vaso in terracotta', type: 'accessory', price: 7.99, image: 'https://via.placeholder.com/200?text=Terracotta+Pot' }
        ];

        setItems(sampleItems);
        setFilteredItems(sampleItems);
    }, []);

    useEffect(() => {
        const results = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterType === 'all' || item.type === filterType)
        );
        setFilteredItems(results);
    }, [searchTerm, filterType, items]);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleAddProduct = (newProduct) => {
        setItems([...items, newProduct]);
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
                <Cart cart={cart} removeFromCart={removeFromCart} closeCart={() => setIsCartOpen(false)} />
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

