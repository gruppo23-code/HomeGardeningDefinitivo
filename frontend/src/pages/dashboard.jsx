'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Leaf, PencilLine, X } from 'lucide-react';
import './css/dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        plantId: '',
        nickname: '',
        plantDate: '',
        image: null
    });
    const [editData, setEditData] = useState({
        id: '',
        nickname: ''
    });
    const [availablePlants, setAvailablePlants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/?showModal=true');
            return;
        }
        loadPlants();
        loadAvailablePlants();
    }, [navigate]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const loadPlants = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8081/cards');
            const processedPlants = response.data.map(plant => {
                let imageUrl = '/placeholder.svg?height=300&width=300';

                if (plant.image && plant.image.data) {
                    try {
                        const base64 = arrayBufferToBase64(plant.image.data);
                        imageUrl = `data:image/jpeg;base64,${base64}`;
                    } catch (err) {
                        console.error('Errore nella conversione dell\'immagine:', err);
                    }
                }

                return {
                    ...plant,
                    imageUrl
                };
            });
            setPlants(processedPlants);
        } catch (err) {
            setError("Errore nel caricamento delle piante");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailablePlants = async () => {
        try {
            const response = await axios.get('http://localhost:8081/listapiante');
            setAvailablePlants(response.data);
        } catch (err) {
            console.error("Errore nel caricamento della lista piante:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.plantId) {
            setError("Seleziona una pianta dalla lista");
            return;
        }

        const submitData = new FormData();
        submitData.append('id', formData.plantId);
        submitData.append('soprannome', formData.nickname);
        submitData.append('data', formData.plantDate);
        if (formData.image) {
            submitData.append('img', formData.image);
        }

        try {
            await axios.post('http://localhost:8081/inviapianta', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            await loadPlants();
            resetForm();
        } catch (err) {
            setError("Errore durante il salvataggio della pianta");
            console.error(err);
        }
    };

    const handleDelete = async (plantId) => {
        if (!window.confirm('Sei sicuro di voler eliminare questa pianta?')) {
            return;
        }

        try {
            await axios.post('http://localhost:8081/delete', { plantId });
            setPlants(plants.filter(plant => plant.id !== plantId));
        } catch (err) {
            setError("Errore durante l'eliminazione della pianta");
            console.error(err);
        }
    };

    const handleEdit = (plant) => {
        setEditData({
            id: plant.id,
            nickname: plant.soprannome_pianta || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/updateplant', editData);
            setShowEditModal(false);
            await loadPlants();
            resetEditForm();
        } catch (err) {
            setError("Errore durante l'aggiornamento della pianta");
            console.error(err);
        }
    };

    const resetEditForm = () => {
        setEditData({
            id: '',
            nickname: ''
        });
        setShowEditModal(false);
    };

    const resetForm = () => {
        setFormData({
            plantId: '',
            nickname: '',
            plantDate: '',
            image: null
        });
        setShowModal(false);
        setError(null);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImagePopup = () => {
        setSelectedImage(null);
    };

    if (!Cookies.get('token')) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="hero-container">
                    <div className="hero-section">
                        <div className="container">
                            <div className="header-content">
                                <div className="header-left">
                                    <div className="icon-wrapper">
                                        <Leaf className="leaf-icon" size={32} />
                                    </div>
                                    <div className="title-wrapper">
                                        <h1 className="dashboard-title">Le tue Piante</h1>
                                        <p className="header-subtitle">Coltiva il tuo giardino personale</p>
                                    </div>
                                </div>
                                <button className="btn btn-custom d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
                                    <Plus size={20} />
                                    Aggiungi Pianta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="container py-4">
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Caricamento...</span>
                            </div>
                            <p className="mt-2 loading-text">Caricamento piante in corso...</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {plants.map(plant => (
                                <div key={plant.id} className="col">
                                    <div className="custom-card">
                                        <div className="position-relative card-image-container">
                                            <img
                                                src={plant.imageUrl}
                                                alt={plant.name}
                                                className="card-img-top"
                                                onClick={() => handleImageClick(plant.imageUrl)}
                                            />
                                            <span className="plant-type-badge">
                                                {plant.type}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{plant.name}</h5>
                                            <div className="nickname-wrapper">
                                                <h6 className="card-subtitle">{plant.soprannome_pianta}</h6>
                                                <button className="btn btn-icon" onClick={() => handleEdit(plant)}>
                                                    <PencilLine size={16} />
                                                </button>
                                            </div>
                                            <p className="card-text">{plant.description}</p>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-delete d-flex align-items-center gap-2"
                                                    onClick={() => handleDelete(plant.id)}
                                                >
                                                    <Trash2 size={18} />
                                                    Elimina
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedImage && (
                        <div className="image-popup-overlay" onClick={closeImagePopup}>
                            <div className="image-popup-content" onClick={e => e.stopPropagation()}>
                                <button className="image-popup-close" onClick={closeImagePopup}>
                                    <X size={24} />
                                </button>
                                <img src={selectedImage} alt="Plant detail" className="image-popup-img" />
                            </div>
                        </div>
                    )}

                    {showEditModal && (
                        <div className="popup-overlay">
                            <div className="popup-modal">
                                <div className="popup-content">
                                    <div className="popup-header">
                                        <h5 className="popup-title">Modifica Soprannome</h5>
                                        <button
                                            className="close-button"
                                            onClick={resetEditForm}
                                            aria-label="Chiudi modale"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="popup-body">
                                        <form onSubmit={handleEditSubmit}>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="nickname">
                                                    Soprannome
                                                </label>
                                                <input
                                                    type="text"
                                                    id="nickname"
                                                    className="custom-input"
                                                    value={editData.nickname}
                                                    onChange={(e) => setEditData({
                                                        ...editData,
                                                        nickname: e.target.value
                                                    })}
                                                    placeholder="Inserisci un soprannome"
                                                    required
                                                />
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={resetEditForm}
                                                >
                                                    Annulla
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-custom"
                                                >
                                                    Salva
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showModal && (
                        <div className="popup-overlay">
                            <div className="popup-modal">
                                <div className="popup-content">
                                    <div className="popup-header">
                                        <h5 className="popup-title">Aggiungi una nuova pianta</h5>
                                        <button className="close-button" onClick={resetForm}>×</button>
                                    </div>
                                    <div className="popup-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-label">Seleziona Pianta</label>
                                                <select
                                                    className="custom-input"
                                                    value={formData.plantId}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        plantId: e.target.value
                                                    })}
                                                    required
                                                >
                                                    <option value="">Seleziona una pianta</option>
                                                    {availablePlants.map(plant => (
                                                        <option key={plant.id} value={plant.id}>
                                                            {plant.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label" htmlFor="nickname">
                                                    Il tuo soprannome
                                                </label>
                                                <input
                                                    type="text"
                                                    className="custom-input"
                                                    value={formData.nickname}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        nickname: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Data di Piantagione</label>
                                                <input
                                                    type="date"
                                                    className="custom-input"
                                                    value={formData.plantDate}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        plantDate: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Immagine</label>
                                                <input
                                                    type="file"
                                                    className="custom-input"
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        image: e.target.files[0]
                                                    })}
                                                    accept="image/*"
                                                />
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                                    Annulla
                                                </button>
                                                <button type="submit" className="btn btn-custom">
                                                    Salva
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

