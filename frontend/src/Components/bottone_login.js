import React from "react";
import profile_img from "../images/icons/profile-circle.svg";


function LoginButton() {
    return (
        <div className="container d-flex justify-content-center align-items-center m-1 w-auto ms-auto btn" data-bs-toggle="modal" data-bs-target="#loginModal">
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
    )
}

export default LoginButton;