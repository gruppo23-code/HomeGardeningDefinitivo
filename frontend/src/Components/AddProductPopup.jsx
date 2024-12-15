import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const AddProductPopup = ({ isOpen, onClose, onAddProduct }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('seeds');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now(),
            name,
            type,
            price: parseFloat(price),
            image: image ? URL.createObjectURL(image) : '/placeholder.svg?height=200&width=200'
        };
        onAddProduct(newProduct);
        onClose();
        setName('');
        setType('seeds');
        setPrice('');
        setImage(null);
    };

    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow" style={{ backgroundColor: '#F1F8E9', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    <div className="modal-header border-bottom-0" style={{ backgroundColor: '#4CAF50' }}>
                        <h5 className="modal-title text-white" style={{ fontSize: '1.8rem', fontWeight: 600 }}>Aggiungi Nuovo Prodotto</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-success" style={{ fontWeight: 500, fontSize: '1.1rem' }}>Nome Prodotto</label>
                                <input
                                    type="text"
                                    className="form-control border-success"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Es. Semi di Pomodoro"
                                    style={{ fontWeight: 400, fontSize: '1rem' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="type" className="form-label text-success" style={{ fontWeight: 500, fontSize: '1.1rem' }}>Tipo di Prodotto</label>
                                <select
                                    className="form-select border-success"
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ fontWeight: 400, fontSize: '1rem' }}
                                >
                                    <option value="seeds">Semi</option>
                                    <option value="plant">Piante</option>
                                    <option value="tool">Attrezzi</option>
                                    <option value="accessory">Accessori</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label text-success" style={{ fontWeight: 500, fontSize: '1.1rem' }}>Prezzo (€)</label>
                                <input
                                    type="number"
                                    className="form-control border-success"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                    style={{ fontWeight: 400, fontSize: '1rem' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image" className="form-label text-success" style={{ fontWeight: 500, fontSize: '1.1rem' }}>Immagine Prodotto</label>
                                <div className="input-group">
                                    <input
                                        type="file"
                                        className="form-control border-success"
                                        id="image"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        accept="image/*"
                                        style={{ fontWeight: 400, fontSize: '1rem' }}
                                    />
                                    <label className="input-group-text border-success" htmlFor="image" style={{ fontWeight: 400, fontSize: '1rem' }}>
                                        <Upload size={18} className="me-2" />
                                        Carica
                                    </label>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-outline-success" onClick={onClose} style={{ fontWeight: 500, fontSize: '1rem' }}>Annulla</button>
                                <button type="submit" className="btn btn-success" style={{ fontWeight: 500, fontSize: '1rem' }}>
                                    <Upload size={20} className="me-2" />
                                    Aggiungi Prodotto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductPopup;

