import React, { useEffect, useState } from "react";
import './css/guide.css';
import axios from "axios";
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Sun, Clock, ThermometerSun, Sprout, Bug, Info } from 'lucide-react';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Guide() {
    const location = useLocation();
    const [ricerca, setRicerca] = useState("");
    const [debouncedRicerca, setDebouncedRicerca] = useState(ricerca);
    const [risultato, setRisultato] = useState([]);
    const [piante, setPiante] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedRicerca(ricerca);
        }, 300);

        return () => {
            clearTimeout(handler);
        }
    }, [ricerca]);

    useEffect(() => {
        axios.post('http://localhost:8081/ricercaguide', { ricerca })
            .then(res => {
                setRisultato(res.data);
            })
            .catch(err => console.log(err));
    }, [debouncedRicerca]);

    const query = useQuery();
    const id_pianta = query.get('id');

    useEffect(() => {
        if (id_pianta) {
            axios.post(`http://localhost:8081/ricercaguide2`, { id_pianta })
                .then(res => {
                    setPiante(res.data[0]);
                })
                .catch(err => console.log(err));
        }
    }, [id_pianta]);

    if (!id_pianta) {
        return (
            <div className="container my-5">
                <header className="bg-success text-white text-center py-5 rounded">
                    <h1 className="guide-title">Guide di Coltivazione</h1>
                    <p className="guide-subtitle">Scopri come coltivare le tue piante preferite!</p>
                    <div className="search-container w-50 mx-auto">
                        <input type="text" className="search-input" placeholder="Cerca..." onChange={(e) => setRicerca(e.target.value)} />
                    </div>
                </header>
                <div style={{ height: '30px' }}></div>
                <div className="row">
                    {risultato.map((pianta) => (
                        <div className="col-md-3 mb-4" key={pianta.id}>
                            <div className="card h-100 guide-card">
                                <img src={`https://image.pollinations.ai/prompt/Pianta_Realistica_InNatura_${encodeURIComponent(pianta.nome)}_${encodeURIComponent(pianta.descrizione)}`} className="card-img-top" alt={pianta.nome} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title guide-card-title">{pianta.nome}</h5>
                                    <p className="card-text guide-card-description flex-grow-1">{pianta.descrizione}</p>
                                    <Link to={`/Guide?id=${pianta.id}`} className="btn btn-primary mt-auto">Leggi di più</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="container my-5">
                {piante && (
                    <>
                        <Link to="/Guide" className="btn btn-link mb-4 guide-back-link">
                            <ArrowLeft size={20} />
                            <span>Torna alle guide</span>
                        </Link>
                        <div className="guide-plant-container">
                            <div className="guide-plant-header">
                                <div className="guide-plant-image">
                                    <img src={`https://image.pollinations.ai/prompt/Pianta_Realistica_InNatura_${encodeURIComponent(piante.nome)}`} alt={`Immagine di ${piante.guida_coltivazione}`} className="img-fluid rounded shadow-sm" />
                                </div>
                                <div className="guide-plant-title-description">
                                    <h1 className="guide-plant-name">{piante.nome}</h1>
                                    <h2 className="guide-plant-subtitle">{piante.descrizione}</h2>
                                    <p className="guide-plant-short-description">{piante.guida_coltivazione}</p>
                                </div>
                            </div>
                            <div className="guide-plant-info">
                                <div className="info-item">
                                    <ThermometerSun size={24} />
                                    <h3>Difficoltà</h3>
                                    <p>{piante.difficolta}</p>
                                </div>
                                <div className="info-item">
                                    <Clock size={24} />
                                    <h3>Tempo di crescita</h3>
                                    <p>{piante.tempo_crescita}</p>
                                </div>
                                <div className="info-item">
                                    <Sun size={24} />
                                    <h3>Esposizione alla luce</h3>
                                    <p>{piante.esposizione_luce}</p>
                                </div>
                                <div className="info-item">
                                    <Droplet size={24} />
                                    <h3>Irrigazione</h3>
                                    <p>{piante.irrigazione}</p>
                                </div>
                                <div className="info-item">
                                    <Sprout size={24} />
                                    <h3>Fertilizzazione</h3>
                                    <p>{piante.fertilizzazione}</p>
                                </div>
                                <div className="info-item">
                                    <Bug size={24} />
                                    <h3>Parassiti e malattie</h3>
                                    <p>{piante.parassiti_malattie}</p>
                                </div>
                                <div className="info-item">
                                    <Info size={24} />
                                    <h3>Note</h3>
                                    <p>{piante.note}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Guide;

