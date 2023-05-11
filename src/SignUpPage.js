// SignUpPage.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { auth } from './firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';

import './AuthPage.css'; // Import the shared CSS file
import { ReactComponent as BrandLogo } from './assets/images/dayze-logo-full.svg';


const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const db = getFirestore(); // Initialize Firestore instance

    const createUserProfile = async (uid, email, name) => {
        const userProfileRef = doc(db, 'userProfiles', uid);
        await setDoc(userProfileRef, {
            email: email,
            name: name,
            createdAt: new Date().toISOString(),
        });
    };

    const registerNewUser = async (event, email, password, name) => { // Add 'name' parameter
        event.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);

            // Create a new document in the userProfiles collection with the user's UID, email, and name
            await createUserProfile(userCredential.user.uid, email, name); // Pass 'name' here

            navigate('/success');
        } catch (error) {
            setError(`Error registering a new user: ${error.message}`);
            console.error('Error registering a new user', error);
        }
    };




    return (
        <div>
            <BrandLogo className="BrandLogo" />
            <h1 className="login-title">Sign Up</h1>
            <div className="auth-container">
                <Card className="card-container-sign-up">
                    <div>
                        {error !== null && <div>{error}</div>}
                        <Form>
                            <Form.Item>
                                <Input
                                    style={{ height: '50px' }}
                                    type="email"
                                    id="userEmail"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    style={{ height: '50px' }}
                                    type="text"
                                    id="userName"
                                    value={name}
                                    placeholder="Full Name"
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input.Password
                                    style={{ height: '50px' }}
                                    type="password"
                                    id="userPassword"
                                    value={password}
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    style={{ height: '50px', width: '100%', marginTop: '16px' }}
                                    type="primary"
                                    onClick={(event) => registerNewUser(event, email, password, name)}>
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                        <p>
                            Back to <Link to="/">Login</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SignUpPage;
