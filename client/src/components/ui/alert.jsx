import React from 'react';

const Alert = ({ type = 'info', children }) => {
    const alertStyles = {
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        color: '#fff',
        backgroundColor: type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3',
    };
    
    return <div style={alertStyles}>{children}</div>;
};

const AlertDescription = ({ children }) => {
    return <p style={{ margin: 0, fontSize: '14px' }}>{children}</p>;
};

export { Alert, AlertDescription };