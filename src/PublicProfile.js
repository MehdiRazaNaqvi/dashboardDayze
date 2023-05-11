import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Card, Button } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { daysToNextBirthday } from './daysToNextBirthday';
import defaultAvatar from './assets/images/default-avatar.svg';
import { ReactComponent as BrandLogo } from './assets/images/dayze-logo-full.svg';

const PublicProfile = () => {
    const { handle } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const db = getFirestore();
            const userProfilesRef = collection(db, 'userProfiles');
            const lowercaseHandle = handle.toLowerCase(); // Convert the handle to lowercase
            const q = query(userProfilesRef, where('handle', '==', lowercaseHandle));

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userProfileData = querySnapshot.docs[0].data();
                setUserProfile(userProfileData);
            } else {
                // Handle case when the handle is not found
            }
        };

        fetchUserProfile();

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [handle]);

    const defaultAvatarUrl = defaultAvatar;

    const handleShare = () => {
        console.log("Share button clicked"); // Debugging line
      
        if (navigator.share) {
          console.log("navigator.share supported"); // Debugging line
      
          navigator
            .share({
              title: `@${handle} | Dayze`,
              url: `https://dayze.me/${handle}`,
            })
            .then(() => {
              console.log("Share successful"); // Debugging line
            })
            .catch((error) => {
              console.log("Error sharing", error);
            });
        } else {
          console.log("Share not supported on this browser");
        }
      };


    return (

        <div className="auth-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {userProfile ? (
                <Card className="card-public">
                    <img
                        src={userProfile.profileImageUrl || defaultAvatarUrl}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <h2>{userProfile.name}</h2>
                    {userProfile.birthday && (
                        <p>Days to Birthday: {daysToNextBirthday(new Date(userProfile.birthday))}</p>
                    )}
                </Card>
            ) : (
                <p>Loading...</p>
            )}
            {isLoggedIn && (
                <Link to="/home">
                    <Button className="fixedButtonBackToHome">
                        <strong>Back to Home</strong>
                    </Button>
                </Link>
            )}
            <Button
                className="share-button"
                onClick={handleShare}
                icon={<ShareAltOutlined />}
                shape="circle"
                type="primary"
            />
            <Link to="/">
                <BrandLogo className='BrandLogoFooter' />
            </Link>
        </div>
    );
};

export default PublicProfile;
