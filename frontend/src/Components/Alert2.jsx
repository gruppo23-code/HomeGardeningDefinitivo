import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

function Alert2({ message, type = 'success', onClose, autoClose = true }) {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    const getAlertStyle = () => {
        const baseStyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '300px',
            textAlign: 'center',
            fontWeight: 500,
            fontFamily: 'var(--font-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            animation: 'slideIn 0.3s ease'
        };

        const styles = {
            success: {
                ...baseStyle,
                backgroundColor: '#E8F5E9',
                border: '2px solid #4CAF50',
                color: '#2E7D32'
            },
            error: {
                ...baseStyle,
                backgroundColor: '#FFEBEE',
                border: '2px solid #EF5350',
                color: '#C62828'
            }
        };

        return styles[type] || styles.success;
    };

    const getIcon = () => {
        const iconProps = { size: 20 };
        return type === 'error' ?
            <XCircle {...iconProps} /> :
            <CheckCircle {...iconProps} />;
    };

    return (
        <>
            <style>
                {`
                    @keyframes slideIn {
                        from {
                            transform: translate(-50%, -60%);
                            opacity: 0;
                        }
                        to {
                            transform: translate(-50%, -50%);
                            opacity: 1;
                        }
                    }
                `}
            </style>
            <div style={getAlertStyle()}>
                {getIcon()}
                <span>{message}</span>
                {!autoClose && onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'inherit'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </>
    );
}

export default Alert2;

