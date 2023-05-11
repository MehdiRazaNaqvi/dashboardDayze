import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';

const LoginHistory = ({ uid }) => {
    const [loginTime, setLoginTime] = useState('');
    const [logoutTime, setLogoutTime] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const loginUser = async () => {
            try {
                const userRef = db.collection('users').doc(uid);
                const historyRef = userRef.collection('loginHistory').doc();
                const loginTimestamp = new Date();

                // Set the initial login time
                setLoginTime(loginTimestamp.toISOString());

                // Set the login history data
                await historyRef.set({
                    loginTime: loginTimestamp,
                    ipAddress: '',
                    location: '',
                });

                // Listen for updates to the login history document
                const unsubscribe = historyRef.onSnapshot((doc) => {
                    const data = doc.data();
                    if (data) {
                        setLogoutTime(data.logoutTime?.toISOString() || '');
                        setIpAddress(data.ipAddress || '');
                        setLocation(data.location || '');
                    }
                });

                // Update the login history document when the user logs out
                return () => {
                    const logoutTimestamp = new Date();
                    historyRef.update({
                        logoutTime: logoutTimestamp,
                        ipAddress: '',
                        location: '',
                    });
                    unsubscribe();
                };

            } catch (error) {
                console.error(error);
            }
        };

        loginUser();
    }, [uid]);

    return (
        <div>
            <p>Login Time: {loginTime}</p>
            <p>Logout Time: {logoutTime}</p>
            <p>IP Address: {ipAddress}</p>
            <p>Location: {location}</p>
        </div>
    );
};

export default LoginHistory;
