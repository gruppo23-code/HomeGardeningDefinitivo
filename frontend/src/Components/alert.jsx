import React from "react";

function Alert({ message }) {
    return (
        <div className="alert alert-danger mt-2" role="alert" style={{ fontSize: '12px' }}>
            {message}
        </div>
    )


export default Alert;