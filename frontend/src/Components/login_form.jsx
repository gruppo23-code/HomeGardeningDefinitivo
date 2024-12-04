import React, { useRef } from "react";
import Alert from "./alert.jsx";
import axios from "axios";

function LoginForm() {
    const [alert, setAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState(''); // Aggiunta per gestire il messaggio di errore

    const [valori, setValori] = React.useState({
        email: '',
        password: '',
    });

    const [utente , setUtente] = React.useState(null);

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/login', valori)
            .then(res => {
                setAlert(false);


                setUtente({nome: res.data.nome, cognome: res.data.cognome});
                window.location.reload();
                //console.log(utente);
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response && (err.response.status === 401 || err.response.status === 404)) {
                    setAlert(true);
                    setAlertMessage('Email o password errate!'); // Imposta il messaggio di errore
                } else {
                    setAlert(true);
                    setAlertMessage('Si è verificato un errore. Riprova.'); // Messaggio generico per altri errori
                }
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group align-content-center d-flex flex-column align-items-center">
                    <div className="mt-1 w-auto">
                        <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp"
                               placeholder="Email"
                               onChange={e => setValori({ ...valori, email: e.target.value })} required />
                    </div>
                    <div className="mt-3 w-auto">
                        <input type="password" className="form-control" id="InputPassword" placeholder="Password"
                               onChange={e => setValori({ ...valori, password: e.target.value })} required />
                    </div>
                    {alert && (<Alert message={alertMessage} />)} {/* Passa il messaggio all'alert */}
                    <div className="mt-3 w-auto">
                        <button type="submit" className="btn btn-success">Accedi</button>
                    </div>
                </div>
            </form>
            {utente && ( // Mostra il messaggio di benvenuto se l'utente è autenticato
                <div className="mt-3">
                    <h1>Benvenuto, {utente.nome} {utente.cognome}!</h1>
                </div>
            )}
        </div>
    )
}

export default LoginForm;