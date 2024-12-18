'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Leaf, PencilLine } from 'lucide-react';
import './css/dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [plants, setPlants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        plantId: '',
        nickname: '',
        plantDate: '',
        image: null
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
        // Implement your edit logic here
        console.log("Editing plant:", plant);
        // You might want to setFormData based on plant data and show the modal
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

    if (!Cookies.get('token')) {
        return null;
    }

    const renderForm = (onSubmit) => (
        <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label className="form-label">Seleziona Pianta</label>
                <select
                    className="form-select custom-select"
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

            <div className="mb-3">
                <label className="form-label">Soprannome</label>
                <input
                    type="text"
                    className="form-control custom-input"
                    value={formData.nickname}
                    onChange={(e) => setFormData({
                        ...formData,
                        nickname: e.target.value
                    })}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Data di Piantagione</label>
                <input
                    type="date"
                    className="form-control custom-input"
                    value={formData.plantDate}
                    onChange={(e) => setFormData({
                        ...formData,
                        plantDate: e.target.value
                    })}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Immagine</label>
                <input
                    type="file"
                    className="form-control custom-input"
                    onChange={(e) => setFormData({
                        ...formData,
                        image: e.target.files[0]
                    })}
                    accept="image/*"
                />
            </div>

            <div className="modal-footer px-0 pb-0">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annulla
                </button>
                <button type="submit" className="btn btn-custom">
                    Salva
                </button>
            </div>
        </form>
    );

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
                        <div className="row row-cols-1 row-cols-lg-2 g-4">
                            {plants.map(plant => (
                                <div key={plant.id} className="col">
                                    <div className="custom-card h-100">
                                        <div className="position-relative">
                                            <img
                                                src={plant.imageUrl}
                                                alt={plant.name}
                                                className="card-img-top"
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

                    {/* Modal Aggiungi */}
                    {showModal && (
                        <div className="popup-modal">
                            <div className="popup-content">
                                <div className="popup-header">
                                    <h5 className="popup-title">Aggiungi una nuova pianta</h5>
                                    <button className="close-button" onClick={resetForm}>×</button>
                                </div>
                                <div className="popup-body">
                                    {renderForm(handleSubmit)}
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

