import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [plants, setPlants] = useState([]);
    const [searchablePlants, setSearchablePlants] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({
        id: null,
        soprannome: "",
        data: "",
        img: null
    });

    // Verifica autenticazione
    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/?showModal=true');
        }
    }, [navigate]);

    // Carica lista piante per la ricerca
    useEffect(() => {
        const fetchSearchablePlants = async () => {
            try {
                const response = await axios.get('http://localhost:8081/listapiante');
                if (Array.isArray(response.data)) {
                    setSearchablePlants(response.data);
                }
            } catch (err) {
                console.error('Errore nel caricamento delle piante:', err);
                setError('Errore nel caricamento delle piante disponibili');
            }
        };

        fetchSearchablePlants();
    }, []);

    // Carica piante dell'utente
    useEffect(() => {
        const fetchUserPlants = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8081/cards');
                const processedPlants = response.data.map((plant) => {
                    if (plant.image) {
                        const base64String = btoa(
                            String.fromCharCode(...new Uint8Array(plant.image.data))
                        );
                        return {
                            ...plant,
                            imageUrl: `data:image/jpeg;base64,${base64String}`
                        };
                    }
                    return {
                        ...plant,
                        imageUrl: '/placeholder.svg?height=200&width=200'
                    };
                });
                setPlants(processedPlants);
            } catch (err) {
                console.error('Errore nel caricamento delle piante:', err);
                setError('Errore nel caricamento delle tue piante');
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlants();
    }, []);

    // Gestione file immagine
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (validTypes.includes(file.type)) {
                setFormValues(prev => ({ ...prev, img: file }));
            } else {
                setError('Formato file non supportato. Usa JPG o PNG.');
            }
        }
    };

    // Invio form nuova pianta
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formValues.id) {
            setError('Seleziona una pianta dalla lista');
            return;
        }

        const formData = new FormData();
        if (formValues.img) {
            formData.append('img', formValues.img);
        }
        formData.append('id', formValues.id.toString());
        formData.append('soprannome', formValues.soprannome);
        formData.append('data', formValues.data);

        try {
            await axios.post('http://localhost:8081/inviapianta', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            window.location.reload();
        } catch (err) {
            console.error('Errore durante il salvataggio:', err);
            setError('Errore durante il salvataggio della pianta');
        }
    };

    // Eliminazione pianta
    const handleDelete = async (plantId) => {
        if (window.confirm('Sei sicuro di voler eliminare questa pianta?')) {
            try {
                await axios.post('http://localhost:8081/delete', { plantId });
                setPlants(plants.filter(plant => plant.id !== plantId));
            } catch (err) {
                console.error('Errore durante l\'eliminazione:', err);
                setError('Errore durante l\'eliminazione della pianta');
            }
        }
    };

    // Modifica pianta
    const handleEdit = (plant) => {
        setFormValues({
            id: plant.id,
            soprannome: plant.soprannome_pianta,
            data: plant.data || '',
            img: null
        });
        setSearchTerm(plant.name);
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormValues({
            id: null,
            soprannome: "",
            data: "",
            img: null
        });
        setSearchTerm("");
        setShowModal(false);
        setError(null);
    };

    // Filtra piante per la ricerca
    const filteredPlants = searchablePlants.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!Cookies.get('token')) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    Devi effettuare l'accesso per visualizzare questa pagina
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    />
                </div>
            )}

            <div className="dashboard-header">
                <h1 className="dashboard-title">Le tue Piante</h1>
                <button
                    className="btn btn-success add-plant-btn"
                    onClick={() => setShowModal(true)}
                >
                    <i className="fas fa-plus me-2"></i>
                    Aggiungi Pianta
                </button>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Caricamento...</span>
                    </div>
                </div>
            ) : (
                <div className="plants-container">
                    {plants.map(plant => (
                        <div key={plant.id} className="plant-card">
                            <div className="plant-image-wrapper">
                                <img
                                    src={plant.imageUrl}
                                    className="plant-image"
                                    alt={plant.name}
                                />
                                <div className="plant-type">
                                    {plant.type}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="plant-name">{plant.name}</h3>
                                <p className="plant-nickname">{plant.soprannome_pianta}</p>
                                <p className="plant-description">{plant.description}</p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn btn-outline-primary btn-edit"
                                    onClick={() => handleEdit(plant)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Modifica
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-delete"
                                    onClick={() => handleDelete(plant.id)}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                    Elimina
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Aggiungi/Modifica Pianta */}
            {showModal && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {formValues.id ? 'Modifica Pianta' : 'Aggiungi una Nuova Pianta'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={resetForm}
                                />
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Seleziona Pianta</label>
                                        <div className="dropdown">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Cerca una pianta..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setShowDropdown(true);
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                            />
                                            {showDropdown && (
                                                <ul className="dropdown-menu show w-100">
                                                    {filteredPlants.length > 0 ? (
                                                        filteredPlants.map(plant => (
                                                            <li
                                                                key={plant.id}
                                                                className="dropdown-item"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => {
                                                                    setSearchTerm(plant.name);
                                                                    setFormValues(prev => ({
                                                                        ...prev,
                                                                        id: plant.id
                                                                    }));
                                                                    setShowDropdown(false);
                                                                }}
                                                            >
                                                                {plant.name}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="dropdown-item disabled">
                                                            Nessuna pianta trovata
                                                        </li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Soprannome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formValues.soprannome}
                                            onChange={(e) => setFormValues(prev => ({
                                                ...prev,
                                                soprannome: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Data di Piantagione</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formValues.data}
                                            onChange={(e) => setFormValues(prev => ({
                                                ...prev,
                                                data: e.target.value
                                            }))}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Foto della Pianta</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleFileChange}
                                            accept="image/jpeg,image/png,image/jpg"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        {formValues.id ? 'Salva Modifiche' : 'Salva'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;

