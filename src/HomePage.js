import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query as createQuery, where, deleteDoc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button } from 'antd';
import EventModal from './EventModal';
import YourEvents from './YourEvents';
import PersonModal from './PersonModal'; // 1. Import PersonModal

import Navbar from './Navbar';
import { calculateDayAge } from './dayAge';
import { daysToNextBirthday } from './daysToNextBirthday';
import { countdownToNextDay } from './countdown';
import defaultAvatar from './assets/images/default-avatar.svg';

const HomePage = () => {
    const [greeting, setGreeting] = useState("");
    const [email, setEmail] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const defaultAvatarUrl = defaultAvatar; // Replace with the actual URL of your default avatar
    const [events, setEvents] = useState([]);
    const [isPersonModalVisible, setIsPersonModalVisible] = useState(false); // 2. Add state to manage PersonModal visibility
    const [now, setNow] = useState(new Date());

    const getEvents = async (uid) => {
        try {
            const db = getFirestore();
            const eventsRef = collection(db, 'events');
            const userEventsQuery = createQuery(eventsRef, where("uid", "==", uid));
            const unsubscribe = onSnapshot(userEventsQuery, (querySnapshot) => {
                const eventList = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setEvents(eventList);
            });
            return unsubscribe;
        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    };

    const handleEditEvent = (event) => {
        console.log('Editing event:', event);
    };

    const togglePersonModal = () => { // 3. Create a function to handle the PersonModal visibility
        setIsPersonModalVisible(!isPersonModalVisible);
    };

    useEffect(() => {
        const auth = getAuth();



        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setEmail(user.email);
                const userProfile = await getUserProfile(user.uid);
                setUserProfile(userProfile);
                getEvents(user.uid);
            } else {
                // Redirect to login page
            }
        });

        const currentHour = new Date().getHours();
        let currentGreeting;
        if (currentHour < 12) {
            currentGreeting = "Good morning";
        } else if (currentHour < 18) {
            currentGreeting = "Good afternoon";
        } else {
            currentGreeting = "Good evening";
        }
        setGreeting(currentGreeting);

        // Update the countdown every second
        const nowInterval = setInterval(() => {
            setNow(new Date());
        }, 1000);


        // Clean up the interval on unmount
        return () => {
            clearInterval(nowInterval);
        };
    }, []);


    const getUserProfile = async (uid) => {
        const db = getFirestore();
        const userProfileRef = doc(db, 'userProfiles', uid);
        const userProfileDoc = await getDoc(userProfileRef);
        if (userProfileDoc.exists()) {
            const userProfileData = userProfileDoc.data();
            return {
                ...userProfileData,
                isSuperUser: userProfileData.isSuperUser || false // Include the isSuperUser field
            };
        } else {
            return null;
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleEventSave = (event) => {
        setEvents((prevEvents) => [...prevEvents, event]);
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const db = getFirestore();
            const eventRef = doc(db, 'events', eventId);
            await deleteDoc(eventRef);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event: ', error);
        }
    };


    return (
        <div>
            <Navbar />
            <div className="auth-container">
                {userProfile && userProfile.birthday ? (
                    <>
                        <p className="day-counter">
                            day<br /><strong>{calculateDayAge(new Date(userProfile.birthday))}</strong>
                        </p>
                    </>
                ) : null}
                <Card className="card-container">
                    <div style={{ textAlign: 'center' }}>
                        <div>

                            {userProfile && userProfile.profileImageUrl ? (
                                <img
                                    src={userProfile.profileImageUrl}
                                    alt="Profile"
                                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <img
                                    src={defaultAvatarUrl}
                                    alt="Profile"
                                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <Link to={`/${userProfile && userProfile.handle}`} className="gradient-link" style={{ display: 'block', marginTop: '0px', fontSize: '16px' }}>
                            {userProfile && userProfile.handle ? `@${userProfile.handle}` : "Claim your username!"}
                        </Link>
                    </div>
                    <h3>
                        {greeting}, {userProfile && userProfile.name ? userProfile.name : email}!
                    </h3>
                    {userProfile && userProfile.birthday ? (
                        <>
                            <p>Days to Birthday: {daysToNextBirthday(new Date(userProfile.birthday))}</p>
                            <p>Time to Next Day: {countdownToNextDay()}</p>
                        </>
                    ) : null}

<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                {userProfile && userProfile.isSuperUser ? (
                    <Button type="primary" onClick={togglePersonModal}>Add Person</Button> // 4. Update the "Add Person" button's onClick event
                ) : <div></div>}
                <EventModal uid={auth.currentUser ? auth.currentUser.uid : null} onEventSave={handleEventSave} />
                <Button onClick={handleLogout}>Logout</Button>
            </div>
                </Card>
                {events.length > 0 && (
                    <YourEvents events={events} onDelete={handleDeleteEvent} onEdit={handleEditEvent} now={now} />
                )}
            </div>
             <PersonModal visible={isPersonModalVisible} onCancel={togglePersonModal} />
        </div>
    );
};

export default HomePage;