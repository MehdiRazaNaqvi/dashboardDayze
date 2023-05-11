import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Form, Typography } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'; // Add this line
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Add this line
import moment from 'moment';



const { Text } = Typography;

const PersonModal = ({ visible, onCancel }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [timeInterval, setTimeInterval] = useState(null);

    const [lastInteracted, setLastInteracted] = useState(moment().format('YYYY-MM-DD'));
    const [lastInteractedTime, setLastInteractedTime] = useState(moment().format('HH:mm:ss'));


    // const togglePersonModal = () => {
    //     console.log('Toggling PersonModal visibility');
    //     setIsModalVisible(!isModalVisible);
    // };

    useEffect(() => {
        if (isModalVisible && !timeInterval) {
            setTimeInterval(
                setInterval(() => {
                    setLastInteractedTime(moment().format('HH:mm:ss'));
                }, 1000)
            );
        }

        // Clean up the interval on unmount
        return () => {
            clearInterval(timeInterval);
        };
    }, [isModalVisible, timeInterval]);




    // const showModal = () => {
    //     setIsModalVisible(true);
    // };

    const handleOk = async () => {
        setIsSaving(true);
        // save new person's details to Firestore
        try {
            const db = getFirestore();
            const peopleRef = collection(db, 'people');
            const newPersonRef = doc(peopleRef); // Create a new person reference
            const newPersonData = {
                name,
                birthday,
                lastInteracted,
                lastInteractedTime,
                imageUrl: '',
            };
            // upload profile image to Firebase Storage
            if (profileImage) {
                const storage = getStorage();
                const imageRef = ref(storage, `images/${newPersonRef.id}`);
                const snapshot = await uploadBytes(imageRef, profileImage); // Update this line
                if (snapshot.state === 'success') {
                    const imageUrl = await getDownloadURL(imageRef);
                    newPersonData.imageUrl = imageUrl;
                }
            }
            await setDoc(newPersonRef, newPersonData); // Update this line to use setDoc
            setSuccessMessage(true);
            setName('');
            setBirthday('');
            setProfileImage(null);
            setLastInteracted('');
            setLastInteractedTime('');
            setIsSaving(false);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error adding new person to Firestore:', error);
            setIsSaving(false);
        }
    };


    const handleCancel = () => {
        onCancel();
    };

    return (
        <div>
            <Button type="primary" onClick={onCancel}>
                Add Person
            </Button>
            <Modal
                title="Add Person"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        icon={isSaving ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        disabled={isSaving}
                    >
                        Save
                    </Button>,
                ]}
            >
                {successMessage && <Text type="success">Person added!</Text>}
                <Form>
                    <Form.Item label="Name">
                        <Input
                            type="text"
                            value={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Birthday">
                        <Input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Profile Image">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                    </Form.Item>
                    <Form.Item label="First Met">
                        <Input
                            type="date"
                            value={lastInteracted}
                            onChange={(e) => setLastInteracted(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Time">
                        <Input
                            type="time"
                            value={lastInteractedTime}
                            onChange={(e) => {
                                clearInterval(timeInterval);
                                setLastInteractedTime(e.target.value);
                            }}
                            onClick={() => clearInterval(timeInterval)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PersonModal;