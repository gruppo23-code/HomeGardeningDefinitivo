'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from 'lucide-react';
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

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                {error && (
                    <div className="error-alert">
                        {error}
                        <button onClick={() => setError(null)}>&times;</button>
                    </div>
                )}

                <div className="dashboard-header">
                    <h1>Le tue Piante</h1>
                    <button className="add-plant-button" onClick={() => setShowModal(true)}>
                        <Plus size={20} />
                        Aggiungi Pianta
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Caricamento piante in corso...</div>
                ) : (
                    <div className="plants-grid">
                        {plants.map(plant => (
                            <div key={plant.id} className="plant-card">
                                <div className="plant-image-container">
                                    <img
                                        src={plant.imageUrl}
                                        alt={plant.name}
                                        className="plant-image"
                                    />
                                    <span className="plant-type">{plant.type}</span>
                                </div>
                                <div className="plant-info">
                                    <h2 className="plant-name">{plant.name}</h2>
                                    <p className="plant-nickname">{plant.soprannome_pianta}</p>
                                    <p className="plant-description">{plant.description}</p>
                                    <div className="plant-actions">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(plant.id)}
                                        >
                                            <Trash2 size={20} />
                                            Elimina
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Aggiungi una nuova pianta</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Seleziona Pianta</label>
                                    <select
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
                                    <label>Soprannome</label>
                                    <input
                                        type="text"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nickname: e.target.value
                                        })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Data di Piantagione</label>
                                    <input
                                        type="date"
                                        value={formData.plantDate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            plantDate: e.target.value
                                        })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Immagine</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            image: e.target.files[0]
                                        })}
                                        accept="image/*"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={resetForm} className="cancel-button">
                                        Annulla
                                    </button>
                                    <button type="submit" className="submit-button">
                                        Salva
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

