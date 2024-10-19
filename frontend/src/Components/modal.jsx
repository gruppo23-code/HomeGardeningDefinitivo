import React from "react";
//import {Link} from "react-router-dom";

function Modal() {
    return (
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="loginModalLabel">Accedi al tuo profilo!</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <a href="/Register">
                            <h6>Nuovo da queste parti? Registrati</h6>
                        </a>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success">Accedi</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;