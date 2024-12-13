import React, {useEffect, useState} from "react";
import './css/guide.css';
import axios from "axios";

function Guide() {
    //Gestione della ricerca
    const [ricerca, setRicerca] = useState("");
    useEffect(() => {
        //console.log(ricerca);
        axios.post('http://localhost:8081/ricercaguide',{ricerca})
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
    }, [ricerca]);


    return (
        <div className="container my-5">
            <header className="bg-success text-white text-center py-5 rounded">
                <h1>Guide di Coltivazione</h1>
                <p>Scopri come coltivare le tue piante preferite!</p>
                <div className="search-container w-50 mx-auto">
                    <input type="text" className="search-input" placeholder="Cerca..." onChange={(e) => setRicerca(e.target.value)} />

                </div>
            </header>
            <div style={{height: '30px'}}></div>
            <div className="row">
                <div className="col-md-3">
                    <div className="card">
                        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Pianta 1"/>
                        <div className="card-body">
                            <h5 className="card-title">Pomodoro</h5>
                            <p className="card-text">Scopri come coltivare pomodori freschi e succosi nel tuo giardino.</p>
                            <a href="#" className="btn btn-primary">Leggi di più</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Pianta 2"/>
                        <div className="card-body">
                            <h5 className="card-title">Basilico</h5>
                            <p className="card-text">Impara a coltivare basilico aromatico per le tue ricette.</p>
                            <a href="#" className="btn btn-primary">Leggi di più</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Pianta 3"/>
                        <div className="card-body">
                            <h5 className="card-title">Peperoncino</h5>
                            <p className="card-text">Scopri i segreti per coltivare peperoncini piccanti.</p>
                            <a href="#" className="btn btn-primary">Leggi di più</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <img src="https://via.placeholder.com/150" className="card-img-top" alt="Pianta 4"/>
                        <div className="card-body">
                            <h5 className="card-title">Rucola</h5>
                            <p className="card-text">Scopri come coltivare rucola fresca e saporita.</p>
                            <a href="#" className="btn btn-primary">Leggi di più</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Guide;