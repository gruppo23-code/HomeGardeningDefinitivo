import React from "react";

function LoginForm(props) {
    return (
        <form>
            <div className="form-group align-content-center d-flex flex-column align-items-center">
                <div className="mt-1 w-auto">
                    <input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Email" />
                </div>
                <div className="mt-3 w-auto">
                    <input type="password" className="form-control" id="InputPassword" placeholder="Password"/>
                </div>
                <div className="mt-3 w-auto">
                    <button type="submit" className="btn btn-success">Accedi</button>
                </div>
            </div>
        </form>
    )
}

export default LoginForm;