import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../assets/img/pianta_stilizzata.jpg';
import './css/dashboard.css';
import alert from "../Components/alert";

function Dashboard() {
    //Codice per generare il json per la visualizzazione delle cards
    const [plants,setPlants] = useState([]);

    const cards = () => {

        axios.get('http://localhost:8081/cards')
            .then(res => {
                console.log(res.data);
                setPlants(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    //Richiamo la funzione non appena viene caricata la pagina
    useEffect(() => {
        cards(); // Chiama la funzione per ottenere le piante al montaggio del componente
    }, []);
    //Verifica aggiornamenti
    useEffect(() => {
        console.log('Plants aggiornati:', plants);
    }, [plants]);


    // Esempio di dati delle piante registrate
    /*const plants = [
        { id: 1, name: "Rosa", type: "Fiore", image: "link-alla-tua-immagine-rosa.jpg", description: "Una pianta bellissima e profumata." },
        { id: 2, name: "Girasole", type: "Fiore", image: "link-alla-tua-immagine-girasole.jpg", description: "Un fiore che segue il sole!" },
        { id: 3, name: "Orchidea", type: "Fiore", image: "link-alla-tua-immagine-orchidea.jpg", description: "Elegante e raffinata." },
    ];*/

    // Stato per gestire la visibilità del modal
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [personalName, setPersonalName] = useState("");
    const [plantingDate, setPlantingDate] = useState("");
    const [photo, setPhoto] = useState(null);

    // Funzione per aprire il modal
    const openModal = () => setShowModal(true);

    // Funzione per chiudere il modal
    const closeModal = () => {
        setShowModal(false);
        // Resetta i campi del modal
        setSearchTerm("");
        setSelectedPlant(null);
        setPersonalName("");
        setPlantingDate("");
        setPhoto(null);
    };

    // Filtra le piante in base al termine di ricerca
    const filteredPlants = plants.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h2>Le tue Piante Registrate</h2>
            <div className="row">
                {plants.map(plant => (
                    <div className="col-md-4 mb-4" key={plant.id}>
                        <div className="card">
                            <img src={plant.image ? plant.image : defaultImage} className="card-img-top plant-image" alt={plant.name} />
                            <div className="card-body">
                                <h5 className="card-title">{plant.name}</h5>
                                <p className="card-text">{plant.description}</p>
                                <p className="text-muted">{plant.type}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Card per aggiungere una nuova pianta */}
                <div className="col-md-4 mb-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Aggiungi una Nuova Pianta</h5>
                            <p className="card-text">Clicca qui per registrare una nuova pianta.</p>
                            <button className="btn btn-success" onClick={openModal}>+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Aggiungi una Nuova Pianta</h5>
                            </div>
                            <div className="modal-body">
                                {/* Barra di ricerca per le piante */}
                                <div className="form-group">
                                    < label htmlFor="plantSearch">Cerca Pianta</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="plantSearch"
                                        placeholder="Cerca per nome"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Selezione della pianta */}
                                {searchTerm && (
                                    <ul className="list-group mb-3">
                                        {filteredPlants.map(plant => (
                                            <li
                                                key={plant.id}
                                                className="list-group-item"
                                                onClick={() => {
                                                    setSelectedPlant(plant);
                                                    setPersonalName(plant.name); // Imposta il nome personale come il nome della pianta selezionata
                                                }}
                                            >
                                                {plant.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Campo "Nome pianta" */}
                                <div className="form-group">
                                    <label htmlFor="personalName">Nome Personale della Pianta</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="personalName"
                                        placeholder="Inserisci un nome personale"
                                        value={personalName}
                                        onChange={(e) => setPersonalName(e.target.value)}
                                    />
                                </div>

                                {/* Data di piantagione */}
                                <div className="form-group">
                                    <label htmlFor="plantingDate">Data di Piantagione</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="plantingDate"
                                        value={plantingDate}
                                        onChange={(e) => setPlantingDate(e.target.value)}
                                    />
                                </div>

                                {/* Upload di una foto */}
                                <div className="form-group">
                                    <label htmlFor="plantPhoto">Carica una Foto</label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="plantPhoto"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Chiudi</button>
                                <button type="button" className="btn btn-primary">Salva</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;