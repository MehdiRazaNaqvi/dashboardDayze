import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AdminDashboard from './AdminDashboard';

const AdminDashboardWrapper = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);

        setIsAdmin(userProfile.isAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <AdminDashboard /> : <Navigate to="/" />;
};

export default AdminDashboardWrapper;
