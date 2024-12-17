import React from 'react';

function Alert({ message }) {
    return (
        <div className="custom-alert" role="alert">
            {message}
        </div>
    );
}

export default Alert;

