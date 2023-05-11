// SuccessScreen.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import './AuthPage.css'; // Import the shared CSS file

const SuccessScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000); // Duration to display the success screen in milliseconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="auth-container">
            <Card className="card-container">
                <h3>Registration Successful!</h3>
                <p>Redirecting to Login...</p>
            </Card>
        </div>
    );
};

export default SuccessScreen;
