import React, {useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Stepper from 'bs-stepper';
import Popover from "./popover.jsx";
import axios from 'axios';
import {useNavigate, Navigate} from "react-router-dom";

const StepperComponent = () => {
    const navigate = useNavigate();
    const stepperRef = useRef(null);
    const stepperInstance = useRef(null);
    //useRef ritorna un oggetto e negli onClick richiamo i metodi .next e .previous implementati nella libreria bs-stepper
    //a differenza di useState, useRef memorizza un valore ma non ri-renderizza

    const [showPopover, setShowPopover] = React.useState(false); //Gestione della visibilità del componente popover

    useEffect(() => {
        stepperInstance.current = new Stepper(stepperRef.current, {
            linear: false,
        });
    }, []);
// useEffect con [] come secondo argomento esegue il codice solo al montaggio del componente, creando una sola istanza di Stepper

    const [valori, setValori] = React.useState({
        email: '',
        nome: '',
        cognome: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault(); // Previene il ricaricamento della pagina
        //console.log(`Registrazione per: ${valori.nome} ${valori.password} ${valori.cognome} ${valori.email}`);
        axios.post('http://localhost:8081/registrazione', valori)
            .then(res => {
                //console.log(res.status);
                console.log("Registrazione riuscita, reindirizzo...");
                //navigate('/');
                return <Navigate to="/" replace/>;
            })
            .catch(err => {
                console.error(err.response.data); // Log dell'errore
                if (err.response.data.error === 'ER_DUP_ENTRY') {
                    //alert(err.response.data.error); //Prendo solo "error" dei parametri ritornati come json
                    setShowPopover(true);
                }
            });

    }

    return (
        <>

            <div className="container mt-4 d-flex align-items-center justify-content-center">
                <div className="border rounded">
                    <Popover
                        title="Email già utilizzata!"
                        content="Forse volevi accedere?"
                        contentLink="Accedi"
                        placement="left"
                        show={showPopover} // Oppure gestisci la visibilità come preferisci
                    />
                    <div className="bs-stepper vertical m-2" ref={stepperRef}>
                        <div className="bs-stepper-header" role="tablist">
                            <div className="step" data-target="#email-part">
                                <button type="button" className="step-trigger" role="tab" aria-controls="email-part"
                                        id="email-part-trigger">
                                    <span className="bs-stepper-circle">1</span>
                                    <span className="bs-stepper-label">Email</span>
                                </button>
                            </div>
                            <div className="line"></div>
                            <div className="step" data-target="#name-part">
                                <button type="button" className="step-trigger" role="tab" aria-controls="name-part"
                                        id="name-part-trigger">
                                    <span className="bs-stepper-circle">2</span>
                                    <span className="bs-stepper-label">Nome</span>
                                </button>
                            </div>
                            <div className="line"></div>
                            <div className="step" data-target="#surname-part">
                                <button type="button" className="step-trigger" role="tab" aria-controls="surname-part"
                                        id="surname-part-trigger">
                                    <span className="bs-stepper-circle">3</span>
                                    <span className="bs-stepper-label">Cognome</span>
                                </button>
                            </div>
                            <div className="line"></div>
                            <div className="step" data-target="#password-part">
                                <button type="button" className="step-trigger" role="tab" aria-controls="password-part"
                                        id="password-part-trigger">
                                    <span className="bs-stepper-circle">4</span>
                                    <span className="bs-stepper-label">Password</span>
                                </button>
                            </div>
                        </div>
                        <div className="bs-stepper-content">
                            <div id="email-part" className="content fade" role="tabpanel"
                                 aria-labelledby="email-part-trigger">
                                <h3>Inserisci Email</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email"
                                               onChange={e => setValori({...valori, email: e.target.value})} required/>
                                    </div>
                                    <button className="btn btn-primary mt-3" type="button"
                                            onClick={() => stepperInstance.current.next()}>
                                        Avanti
                                    </button>
                                </form>
                            </div>
                            <div id="name-part" className="content fade" role="tabpanel"
                                 aria-labelledby="name-part-trigger">
                                <h3>Inserisci Nome</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Nome</label>
                                        <input type="text" className="form-control" id="name"
                                               onChange={e => setValori({...valori, nome: e.target.value})} required/>
                                    </div>
                                    <button className="btn btn-primary mt-3 me-3" type="button"
                                            onClick={() => stepperInstance.current.previous()}>
                                        Indietro
                                    </button>
                                    <button className="btn btn-primary mt-3" type="button"
                                            onClick={() => stepperInstance.current.next()}>
                                        Avanti
                                    </button>
                                </form>
                            </div>
                            <div id="surname-part" className="content fade" role="tabpanel"
                                 aria-labelledby="surname-part-trigger">
                                <h3>Inserisci Cognome</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="surname">Cognome</label>
                                        <input type="text" className="form-control" id="surname"
                                               onChange={e => setValori({...valori, cognome: e.target.value})}
                                               required/>
                                    </div>
                                    <button className="btn btn-primary mt-3 me-3" type="button"
                                            onClick={() => stepperInstance.current.previous()}>
                                        Indietro
                                    </button>
                                    <button className="btn btn-primary mt-3" type="button"
                                            onClick={() => stepperInstance.current.next()}>
                                        Avanti
                                    </button>
                                </form>
                            </div>
                            <div id="password-part" className="content fade" role="tabpanel"
                                 aria-labelledby="password-part-trigger">
                                <h3>Inserisci Password</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password"
                                               onChange={e => setValori({...valori, password: e.target.value})}
                                               required/>
                                        {/* Spiegazione onChange ;e = evento , target punta all'elemento HTML che ha causato l'evento mentre .value al valore */}
                                        {/* ... Operatore di spread, mi permette di preservare i valori degli altri attributi che voglio memorizzare, variandone solo uno */}
                                    </div>
                                    <button className="btn btn-primary mt-3 me-3" type="button"
                                            onClick={() => stepperInstance.current.previous()}>
                                        Indietro
                                    </button>
                                    <button className="btn btn-success mt-3" type="submit">
                                        Registrati
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepperComponent;
