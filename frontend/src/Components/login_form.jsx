import React, {useRef} from "react";
import Alert from "./alert.jsx";
import axios from "axios";

function LoginForm() {
    const alertRef = useRef(null);
    const [alert, setAlert] = React.useState(false);

    const [valori, setValori] = React.useState({
        email: '',
        password: '',
    });

    axios.defaults.withCredentials = true; //Dico ad axios di inviare i cookie insieme alle richieste al server

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/login', valori)
            .then(res => {
                //Ritorno la stringa "SUCCESSO" nel backend
                setAlert(false)
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                //Catturo il codice di errore 401
                //Errore 401 = Unauthorized: L'accesso alla risorsa è negato per mancanza di credenziali valide.
                /*if (err.response.status === 401 || err.response.status === 404) {
                    setAlert(true);
                }*/
            })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group align-content-center d-flex flex-column align-items-center">
                <div className="mt-1 w-auto">
                    <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp"
                           placeholder="Email"
                           onChange={e => setValori({...valori, email: e.target.value})} required/>
                </div>
                <div className="mt-3 w-auto">
                    <input type="password" className="form-control" id="InputPassword" placeholder="Password"
                           onChange={e => setValori({...valori, password: e.target.value})} required/>
                </div>
                {alert && (<Alert/>)}
                <div className="mt-3 w-auto">
                    <button type="submit" className="btn btn-success">Accedi</button>
                </div>
            </div>
        </form>
    )
}

export default LoginForm;