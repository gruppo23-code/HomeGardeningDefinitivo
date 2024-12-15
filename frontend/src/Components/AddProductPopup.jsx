import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddProductPopup = ({ isOpen, onClose, onAddProduct }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('seeds');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now(), // Usiamo il timestamp come ID temporaneo
            name,
            type,
            price: parseFloat(price),
            image: image ? URL.createObjectURL(image) : '/placeholder.svg?height=200&width=200'
        };
        onAddProduct(newProduct);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-popup" onClick={onClose}>
                    <X size={24} />
                </button>
                <h2>Aggiungi Nuovo Prodotto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nome Prodotto</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Tipo di Prodotto</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="seeds">Semi</option>
                            <option value="plant">Piante</option>
                            <option value="tool">Attrezzi</option>
                            <option value="accessory">Accessori</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Prezzo</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Immagine Prodotto</label>
                        <input
                            type="file"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>
                    <button type="submit" className="add-product-button">Aggiungi Prodotto</button>
                </form>
            </div>
        </div>
    );
};

export default AddProductPopup;

