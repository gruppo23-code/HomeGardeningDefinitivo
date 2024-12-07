import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../assets/img/pianta_stilizzata.jpg';
import './css/dashboard.css';
import alert from "../Components/alert";
import Cookies from "js-cookie";
import FormData from 'form-data';

function Dashboard() {
    const [showModal, setShowModal] = useState(false); // Stato per gestire la visibilità del modal
    const [pianta, setPianta] = useState("");

    const [pianteRicerca, setPianteRicerca] = useState([]);
    //Ricerca nel db delle piante per la barra
    const ricercaPiante = () => {
        axios.get('http://localhost:8081/listapiante')
            .then(res => {
                //console.log(res.data);
                if (Array.isArray(res.data)) {
                    setPianteRicerca(res.data);
                    //console.log(res.data);
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
                console.log(res.data);

                const updatedPlants = res.data.map(plant => {
                    if (plant.image) {
                        // Converti il buffer in base64
                        const base64String = btoa(String.fromCharCode(...new Uint8Array(plant.image.data)));
                        const imageUrl = `data:image/jpg;base64,${base64String}`; // Assicurati di usare il tipo corretto
                        //console.log('Image URL:', imageUrl); // Stampa l'URL dell'immagine
                        return { ...plant, imageUrl }; // Aggiungi l'URL dell'immagine all'oggetto pianta
                    }
                    return { ...plant, imageUrl: defaultImage }; // Usa l'immagine predefinita se non c'è immagine
                });
                setPlants(updatedPlants); // Imposta le piante aggiornate nello stato
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
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
        const formData = new FormData();
        if (valori.img) {
            formData.append('img', valori.img);
            formData.append('id', valori.id);
            formData.append('soprannome', valori.nome);
            formData.append('data', valori.data);
            // Invia formData al backend
            axios.post('http://localhost:8081/inviapianta', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Tipo di contenuto
                }
            })
                .then(r => {
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            axios.post('http://localhost:8081/inviapianta', valori)
                .then(r => {
                    window.location.reload();
                })
                .catch(err => {
                    console.log(err);
                })
        }
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

    //Gestione barra di ricerca piante
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const filteredPlants = Array.isArray(pianteRicerca) ?
        pianteRicerca.filter(plant =>
            typeof plant.name === 'string' &&
            typeof searchTerm === 'string' &&
            plant.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    useEffect(() => {
        //console.log("ID selezionato:", selectedId);
        setValori({ ...valori, id: selectedId })
    }, [selectedId]);

    const handleOnChange = (e) => { //Inutile, la lascio per comodità :)
        setSearchTerm(e.target.value)
        setValori({ ...valori, id: selectedId })
    }

    //Fine gestione barra di ricerca piante

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
                                <img
                                    src={plant.imageUrl} // Usa l'URL dell'immagine preparato
                                    alt={plant.name}
                                    className="card-img-top plant-image"
                                />
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

                                        {/*Inserisci barra di ricerca*/}
                                        <label htmlFor="personalName">Scegli la pianta</label>
                                        <div className="dropdown">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Cerca una pianta..."
                                                onFocus={() => setIsOpen(true)}
                                                onBlur={() => setIsOpen(false)}
                                                onChange={handleOnChange}
                                                value={searchTerm}
                                            />
                                            {isOpen && (
                                                <ul className="dropdown-menu show">
                                                    {filteredPlants.length > 0 ? (
                                                        filteredPlants.map((plant) => (
                                                            <li
                                                                key={plant.id}
                                                                className="dropdown-item"
                                                                onMouseDown={() => {
                                                                    setSearchTerm(plant.name);
                                                                    setSelectedId(plant.id); // Memorizza l'ID selezionato
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                {plant.name}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="dropdown-item disabled">Nessuna pianta
                                                            trovata</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>


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
                                                accept="image/jpg"
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