import React, { useEffect, useState } from "react";
import './css/guide.css';
import axios from "axios";
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Guide() {
    const location = useLocation();
    const [ricerca, setRicerca] = useState("");
    const [debouncedRicerca, setDebouncedRicerca] = useState(ricerca);
    const [risultato, setRisultato] = useState([]);
    const [piante, setPiante] = useState([]);

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
                                    <a href={`http://localhost:3000/Guide?id=${pianta.id}`} className="btn btn-primary mt-auto">Leggi di più</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="pianta-card mt-3 mb-3 w-75 mx-auto">
                {piante && (
                    <>
                        <div className="container d-flex justify-content-center align-items-center">
                            <img src={`https://image.pollinations.ai/prompt/Pianta_Realistica_InNatura_${encodeURIComponent(piante.nome)}`} alt={`Immagine di ${piante.guida_coltivazione}`} className="pianta-image" />
                        </div>
                        <h2 className="mt-4 mb-3">{piante.guida_coltivazione}</h2>
                        <p><strong>Difficoltà:</strong> {piante.difficolta}</p>
                        <p><strong>Tempo di crescita:</strong> {piante.tempo_crescita}</p>
                        <p><strong>Esposizione alla luce:</strong> {piante.esposizione_luce}</p>
                        <p><strong>Irrigazione:</strong> {piante.irrigazione}</p>
                        <p><strong>Fertilizzazione:</strong> {piante.fertilizzazione}</p>
                        <p><strong>Parassiti e malattie:</strong> {piante.parassiti_malattie}</p>
                        <p><strong>Note:</strong> {piante.note}</p>
                    </>
                )}
            </div>
        );
    }
}

export default Guide;

