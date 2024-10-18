import React from "react";

function Registrazione() {
    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="col-auto">
                <div className="row-auto">
                    <label htmlFor="formGroupExampleInput" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="formGroupExampleInput"
                           placeholder="Example input placeholder"/>
                </div>
                <div className="row-auto">
                    <label htmlFor="formGroupExampleInput2" className="form-label">Cognome</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2"
                           placeholder="Another input placeholder"/>
                </div>
                <div className="row-auto">
                    <label htmlFor="formGroupExampleInput2" className="form-label">Email</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2"
                           placeholder="Another input placeholder"/>
                </div>
                <div className="row-auto">
                    <label htmlFor="formGroupExampleInput2" className="form-label">Password</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2"
                           placeholder="Another input placeholder"/>
                </div>
            </div>
            <button type="button" className="btn btn-primary">Primary</button>
        </div>
    );
}

export default Registrazione;