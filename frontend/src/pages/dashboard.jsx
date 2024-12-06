import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../assets/img/pianta_stilizzata.jpg';
import './css/dashboard.css';
import alert from "../Components/alert";
import Cookies from "js-cookie";

function Dashboard() {
    const [showModal, setShowModal] = useState(false); // Stato per gestire la visibilità del modal
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [pianta, setPianta] = useState("");

    const [pianteRicerca, setPianteRicerca] = useState([]);
    //Ricerca nel db delle piante per la barra
    const ricercaPiante = () => {
        axios.get('http://localhost:8081/listapiante')
            .then(res => {
                //console.log(res.data);
                if (Array.isArray(res.data)) {
                    setPianteRicerca(res.data);
                    console.log(pianteRicerca);
                } else {
                    console.error("Non è un array:" + res.data);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        ricercaPiante();
    }, []);
    useEffect(() => {
        //console.log("Piante Ricerca:", pianteRicerca);
    }, [pianteRicerca]);


    //Codice per generare il json per la visualizzazione delle cards
    const [plants,setPlants] = useState([]);

    const cards = () => {

        axios.get('http://localhost:8081/cards')
            .then(res => {
                //console.log(res.data);
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
        //console.log('Plants aggiornati:', plants);
    }, [plants]);


    //Gestione registrazione nuova pianta
    const [valori, setValori] = useState({
        id: null,
        soprannome: '',
        data: '',
        img: null,
    });

    const handleChange = (e) => { //Gestione dei due onChange sulla barra di ricerca
        setSearchTerm(e.target.value);
        setValori({ ...valori, id: selectedPlantId })
        console.log(valori);
    }

    const handleFileChange = (e) => {
        const foto = e.target.files[0]; //Prendo il primo file
        const validExtensions = ['image/jpeg', 'image/png'];
        const isValidFile = validExtensions.includes(foto.type); //Controllo estensione del file
        if (isValidFile) {
            setValori({ ...valori, img: foto });
        } else {
            console.error("Tipo di file non valido");
            alert("Tipo di file non valido!!!");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(valori);
    }
    //Fine gestione registrazione nuova pianta


    // Funzione per aprire il modal
    const openModal = () => setShowModal(true);

    // Funzione per chiudere il modal
    const closeModal = () => {
        setShowModal(false);
        // Resetta i campi del modal
        setSearchTerm("");
        setValori({
            id: null,
            soprannome: '',
            data: '',
            img: null
        })
    };


    // Filtra le piante in base al termine di ricerca
    const filteredPlants = Array.isArray(pianteRicerca) ?
        pianteRicerca.filter(plant =>
            plant.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];


    //Verifica se l'utente è loggato e quindi se è presente il token all'interni dei cookie
    const isLoggedIn = () => {
        const token = Cookies.get('token');
        return !!token; // Ritorna true se il token esiste, false altrimenti
    };

    if (isLoggedIn()) {
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
                    <form onSubmit={handleSubmit}>
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Aggiungi una Nuova Pianta</h5>
                                    </div>
                                    <div className="modal-body">
                                        {/* Barra di ricerca per le piante */}
                                        <div className="form-group">
                                            <label htmlFor="plantSearch">Cerca Pianta</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="plantSearch"
                                                placeholder="Cerca per nome"
                                                value={searchTerm}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Selezione della pianta */}
                                        {searchTerm && (
                                            <ul className="list-group mb-3"
                                                style={{position: 'absolute', zIndex: 9999}}>
                                                {filteredPlants.slice(0, 6).map(plant => (
                                                    <li
                                                        key={plant.id}
                                                        className="list-group-item"
                                                        onClick={() => {
                                                            setSearchTerm(plant.id);
                                                            setPianteRicerca(plant);
                                                            setSearchTerm(plant.name);

                                                        }}
                                                    >
                                                        {plant.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* Campo "Nome pianta" */}
                                        <div className="form-group">
                                            <label htmlFor="personalName">Soprannome della Pianta</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="personalName"
                                                placeholder="Inserisci un nome personale"
                                                value={valori.soprannome}
                                                onChange={e => setValori({...valori, soprannome: e.target.value})}
                                            />
                                        </div>

                                        {/* Data di piantagione */}
                                        <div className="form-group">
                                            <label htmlFor="plantingDate">Data di Piantagione</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="plantingDate"
                                                onChange={e => setValori({...valori, data: e.target.value})}
                                            />
                                        </div>

                                        {/* Upload di una foto */}
                                        <div className="form-group">
                                            <label htmlFor="plantPhoto">Carica una Foto</label>
                                            <input
                                                type="file"
                                                className="form-control-file"
                                                id="plantPhoto"
                                                onChange={handleFileChange}
                                                accept="image/jpeg, image/png, image/gif"
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={closeModal}>Chiudi
                                        </button>
                                        <button type="submit" className="btn btn-primary">Salva</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        );
    } else {
        return (
            <div className="container justify-content-center">
                <div className="alert alert-danger text-center" role="alert">
                    Devi essere loggato per poter visualizzare questa pagina!!!
                </div>
            </div>
        )
    }

}

export default Dashboard;