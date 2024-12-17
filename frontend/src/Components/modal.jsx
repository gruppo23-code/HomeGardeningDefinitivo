import React from "react";
import LoginForm from "./login_form";
import "./css/Modal.css";

function Modal() {
    return (
        <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;

