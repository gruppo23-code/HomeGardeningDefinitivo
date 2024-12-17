import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "./alert";
import axios from "axios";
import "./css/LoginForm.css";

function LoginForm() {
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [valori, setValori] = useState({
        email: '',
        password: '',
    });
    const [utente, setUtente] = useState(null);

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/login', valori)
            .then(res => {
                setAlert(false);
                setUtente({nome: res.data.nome, cognome: res.data.cognome});
                window.location.reload();
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response && (err.response.status === 401 || err.response.status === 404)) {
                    setAlert(true);
                    setAlertMessage('Email o password errate!');
                } else {
                    setAlert(true);
                    setAlertMessage('Si è verificato un errore. Riprova.');
                }
            });
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Benvenuto</h2>
                        <p>Accedi al tuo account Home Gardening</p>
                        <div className="register-prompt">
                            <span>Nuovo da queste parti? </span>
                            <Link
                                to="/registrazione"
                                className="register-link"
                                onClick={() => {
                                    // Rimuovi il modal-backdrop
                                    const backdrop = document.querySelector('.modal-backdrop');
                                    if (backdrop) {
                                        backdrop.remove();
                                    }
                                    // Rimuovi la classe modal-open dal body
                                    document.body.classList.remove('modal-open');
                                }}
                            >
                                Registrati
                            </Link>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="InputEmail">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="InputEmail"
                                placeholder="Inserisci la tua email"
                                onChange={e => setValori({ ...valori, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="InputPassword">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="InputPassword"
                                placeholder="Inserisci la tua password"
                                onChange={e => setValori({ ...valori, password: e.target.value })}
                                required
                            />
                        </div>
                        {alert && <Alert message={alertMessage} />}
                        <div className="buttons-container">
                            <button type="submit" className="login-btn">
                                Accedi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;

