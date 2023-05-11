import React, { useState, useEffect } from 'react';
import { Button, Modal, Input } from 'antd';
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import moment from 'moment';

const EventModal = ({ uid }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState(moment().format('YYYY-MM-DD'));
    const [eventTime, setEventTime] = useState(moment().format('HH:mm:ss'));
    const [isTimeEditable, setIsTimeEditable] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleOk(); // Call the existing handleOk function to add the event
    };

    useEffect(() => {
        if (isModalVisible && !isTimeEditable) {
            const interval = setInterval(() => {
                setEventTime(moment().format('HH:mm:ss'));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isModalVisible, isTimeEditable]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);

        const firestoreEventDateTime = eventDate
            ? moment(eventDate).set({
                hour: eventTime ? moment(eventTime, 'HH:mm').hour() : 0,
                minute: eventTime ? moment(eventTime, 'HH:mm').minute() : 0,
                second: eventTime ? moment(eventTime, 'HH:mm:ss').second() : 0,
                millisecond: 0,
            }).toDate()
            : null;

        const eventData = {
            title: eventTitle,
            description: eventDescription,
            date: firestoreEventDateTime ? Timestamp.fromDate(firestoreEventDateTime) : serverTimestamp(),
        };

        onEventSave(eventData);

        setEventTitle('');
        setEventDescription('');
        setEventDate(moment().format('YYYY-MM-DD'));
        setEventTime(moment().format('HH:mm:ss'));
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onEventSave = async (eventData) => {
        try {
            const db = getFirestore();
            const eventsRef = collection(db, 'events');
            await addDoc(eventsRef, { ...eventData, uid }); // Add uid to eventData
        } catch (error) {
            console.error('Error adding event: ', error);
        }
    };

    return (
        <div>
          <Button type="primary" onClick={showModal}>
            Add Event
          </Button>
          <Modal
            title="Add Event"
            visible={isModalVisible}
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
                disabled={uid === null} // Disable the button when uid is null
              >
                Save
              </Button>,
            ]}
          >
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Event Title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <br />
                    <br />
                    <Input.TextArea
                        placeholder="Event Description"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                    <br />
                    <br />
                    <Input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                    />
                    <br />
                    <br />
                    <Input
                        type="time"
                        placeholder="Event Time"
                        value={eventTime}
                        onChange={(e) => {
                            setIsTimeEditable(true);
                            setEventTime(e.target.value);
                        }}
                        onClick={() => setIsTimeEditable(true)}
                    />
                    <br />
                    <br />
                    <Button type="primary" htmlType="submit" style={{ display: "none" }}>
                        Hidden Submit Button
                    </Button>
                </form>
            </Modal>
            {uid === null && <p>Loading...</p>} {/* Show loading indicator when uid is null */}
        </div>
    );
};

export default EventModal;

