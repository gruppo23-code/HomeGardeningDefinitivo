import React, {forwardRef} from "react";
import profile_img from "../assets/img/profile-circle.svg";
import Cookies from "js-cookie";
import {Link} from "react-router-dom";

//forwardRef serve per ereditare la ref dalla pagina in cui è richiamato
const LoginButton = forwardRef(( props, ref) => {
    const isLoggedIn = () => {
        const token = Cookies.get('token'); // Sostituisci 'token' con il nome del tuo cookie
        return !!token; // Ritorna true se il token esiste, false altrimenti
    };

    const handleLogout = () => {
        // Rimuove il token dai cookie
        Cookies.remove('token');
        window.location.reload(); // Ricarica la pagina per riflettere il cambiamento
    };

    // Controlla se l'utente è loggato
    if (isLoggedIn()) {
        return(
            <>
                <div className="btn-group pb-1">
                    <Link to={"/Profilo"} className="btn btn-light btn-sm text-decoration-none text-black">
                        <h6 className="m-0">Profilo</h6>
                    </Link>
                    <button type="button" className="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                            <a className="dropdown-item text-danger" href="/" onClick={handleLogout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </>
        ); // Non mostra nulla se l'utente è loggato
    }

    return (
        <div className="container d-flex justify-content-center align-items-center m-1 w-auto ms-auto btn"
             data-bs-toggle="modal" data-bs-target="#loginModal" ref={ref}>
            <div className="row">
                <div className="col-6 d-flex align-content-center justify-content-center ps-0 pe-1">
                    <img className="img-fluid mx-auto" src={profile_img} alt="Immagine profilo"/>
                </div>
                <div className="col-6 align-content-center ps-1 pe-0">
                    <div className="row justify-content-center h-auto">
                        <span style={{fontSize: '10px'}}>Accedi</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
//{isLoggedIn() ? 'Profilo' : 'Accedi'}
export default LoginButton;