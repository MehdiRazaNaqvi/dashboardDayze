// LoginPage.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';

import './AuthPage.css';
import { ReactComponent as BrandLogo } from './assets/images/dayze-logo-full.svg';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signInWithEmailAndPasswordHandler = async (event, usernameOrEmail, password) => {
    event.preventDefault();
    let email = usernameOrEmail;
    
    if (!usernameOrEmail.includes('@')) {
      try {
        const userProfilesRef = collection(db, 'userProfiles');
        const q = query(userProfilesRef, where('handle', '==', usernameOrEmail));

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setError('Error signing in with username and password');
          return;
        }
        email = querySnapshot.docs[0].data().email;
      } catch (error) {
        setError('Error signing in with username and password');
        console.error('Error signing in with username and password', error);
        return;
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError('Error signing in with password and email!');
      console.error('Error signing in with password and email', error);
    }
  };

  return (
    <div>
      <BrandLogo className="BrandLogo" />
      <h1 className="login-title">Experience life in days.</h1>
      <div className="auth-container">
        <Card className="card-container-login">
          
          <div>
            {error !== null && <div>{error}</div>}
            <Form
              onFinish={(event) =>
                signInWithEmailAndPasswordHandler(event, usernameOrEmail, password)
              }
            >
              <Form.Item>
                <Input
                  type="text"
                  style={{ height: '50px' }}
                  value={usernameOrEmail}
                  placeholder="Email or Username"
                  onChange={(event) => setUsernameOrEmail(event.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password
                  style={{ height: '50px' }}
                  value={password}
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ height: '50px', width: '100%', marginTop: '16px' }}
                  onClick={(event) =>
                    signInWithEmailAndPasswordHandler(event, usernameOrEmail, password)
                  }
                  htmlType="submit"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;