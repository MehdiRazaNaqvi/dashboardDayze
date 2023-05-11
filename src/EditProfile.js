import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, getDocs, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Form, Input, Button, Card, Typography } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

import Navbar from './Navbar';
import defaultAvatar from './assets/images/default-avatar.svg';

const { Title, Text } = Typography;

const EditProfile = () => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(moment().format('YYYY-MM-DD'));
  const [profileImage, setProfileImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [location, setLocation] = useState('');
  const [uid, setUid] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [handle, setHandle] = useState('');
  const [handleError, setHandleError] = useState('');
  const [displayImage, setDisplayImage] = useState(null);


  const isHandleValid = (handle) => {
    const minLength = 1; // Minimum length for a username
    const maxLength = 30; // Maximum length for a username
    const handlePattern = /^[a-z0-9_]+$/;

    return handle.length >= minLength && handle.length <= maxLength && handlePattern.test(handle);
  };

  const checkHandleExists = async (handle) => {
    const db = getFirestore();
    const usersRef = collection(db, 'userProfiles');
    const querySnapshot = await getDocs(query(usersRef, where('handle', '==', handle)));

    let handleExists = false;

    querySnapshot.forEach((doc) => {
      if (doc.id !== uid) {
        handleExists = true;
      }
    });

    return handleExists;
  };


  const handleSubmit = async () => {
    if (!uid) return;
    if (!handle) {
      setHandleError('Username is required');
      return;
    }

    if (!isHandleValid(handle)) {
      setHandleError('Username can only contain lowercase letters, numbers, and underscores, and be 1-30 characters long');
      return;
    }

    try {
      setIsSaving(true);

      if (handle !== userProfile.handle) {
        const handleExists = await checkHandleExists(handle);
        if (handleExists) {
          setHandleError('Username is already taken');
          setIsSaving(false);
          return;
        } else {
          setHandleError('');
        }
      }

      const defaultAvatarUrl = defaultAvatar;

      const profileImageUrl = profileImage ? await uploadProfileImage(uid, profileImage) : defaultAvatarUrl;
      const data = {
        ...userProfile,
        name,
        birthday,
        location,
        handle,
        email: userProfile.email,
      };
      if (profileImageUrl) {
        data.profileImageUrl = profileImageUrl;
      } else if (userProfile && userProfile.profileImageUrl) {
        data.profileImageUrl = userProfile.profileImageUrl;
      } else {
        data.profileImageUrl = defaultAvatarUrl;
      }

      const db = getFirestore();
      await setDoc(doc(db, 'userProfiles', uid), data);
      setSuccessMessage(true);

    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userProfile = await getUserProfile(user.uid);
        setUserProfile({ ...userProfile, email: user.email, uid: user.uid });

        if (userProfile) {
          setName(userProfile.name || '');
          if (userProfile.birthday) {
            setBirthday(userProfile.birthday);
          }
          if (userProfile.handle) {
            setHandle(userProfile.handle);
          }
          if (userProfile.location) {
            setLocation(userProfile.location);
          }
          if (userProfile.profileImageUrl) {
            setDisplayImage(userProfile.profileImageUrl);
          } else {
            setDisplayImage(defaultAvatar);
          }
        }
      }
    });
  }, []);




  const getUserProfile = async (uid) => {
    const db = getFirestore();
    const userProfileRef = doc(db, 'userProfiles', uid);
    const userProfileDoc = await getDoc(userProfileRef);
    if (userProfileDoc.exists()) {
      return userProfileDoc.data();
    } else {
      return null;
    }
  };



  const uploadProfileImage = async (uid, imageFile) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${uid}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };


  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <Card className="card-container">
          <Title level={3}>Edit Profile</Title>
          <Form>
          <Form.Item label="Profile Image">
              <img src={displayImage} alt="Profile" width="100" height="100" style={{ marginBottom: '1rem', borderRadius: "50%"  }} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                  setDisplayImage(URL.createObjectURL(e.target.files[0]));
                  handleSubmit();
                }}
              />
            </Form.Item>
            <Form.Item label="Name">
              <Input
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSubmit}
              />
            </Form.Item>
            <Form.Item label="Username" help={handleError} validateStatus={handleError ? 'error' : ''}>
              <Input
                type="text"
                maxLength={30} // Set the max length for the username input field
                value={handle}
                placeholder="Visible to all members"
                onChange={(e) => setHandle(e.target.value)}
                onBlur={handleSubmit}
              />
            </Form.Item>
            <Form.Item label="Birthday">
              <input
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  handleSubmit();
                }}
              />
            </Form.Item>
            <Form.Item label="Location">
              <Input
                type="text"
                value={location}
                placeholder="Your City"
                onChange={(e) => setLocation(e.target.value)}
                onBlur={handleSubmit}
              />
            </Form.Item>
 
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                icon={isSaving ? <LoadingOutlined /> : <CheckCircleOutlined />}
                disabled={isSaving}
              >
                Save
              </Button>
              {successMessage && <Text type="success">Profile saved!</Text>}
            </Form.Item>
          </Form>
          <Link to="/home">Back to Home</Link>
        </Card>
      </div>
    </div>
  );
}
export default EditProfile;
