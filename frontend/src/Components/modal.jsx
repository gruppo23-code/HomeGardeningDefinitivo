import React from "react";
import LoginForm from "./login_form";

//import {Link} from "react-router-dom";

function Modal() {
    return (
        <div className="modal fade modal-sm" id="loginModal" tabIndex="-1" aria-labelledby="loginModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="row">
                        <div className="d-flex justify-content-end align-items-end m-0">
                            <button type="button" className="btn-close pt-3 pe-3" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                    </div>
                    <div className="modal-body pt-0">
                        <div className="container ps-0">
                            <h1 className="modal-title fs-5" id="loginModalLabel">Accedi al tuo profilo!</h1>
                            <div className="container d-flex ps-0">
                                <p style={{fontSize: '12px'}}>Nuovo da queste parti?&nbsp;</p>
                                <a href="/registrazione">
                                    <p style={{fontSize: '12px'}}>Registrati</p>
                                </a>
                            </div>
                        </div>
                        <LoginForm/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;