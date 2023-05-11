import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Card, Typography, Descriptions } from 'antd';
import Table from "./components/table"
import { updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button, Popconfirm } from 'antd';


const { Title } = Typography;

const AdminDashboard = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [averageTimeSpent, setAverageTimeSpent] = useState(0);
  const [averageProfileCompletion, setAverageProfileCompletion] = useState(0);
  const [accountCreationTimestamps, setAccountCreationTimestamps] = useState([]);
  const [userProfilesWithAge, setUserProfilesWithAge] = useState([]);

  console.log(userProfilesWithAge)
  const fetchData = useCallback(async () => {
    const db = getFirestore();
    const userProfilesRef = collection(db, 'userProfiles');

    const querySnapshot = await getDocs(userProfilesRef);
    const profiles = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const eventsSnapshot = data.uid ? await getDocs(query(collection(db, "events"), where("uid", "==", data.uid))) : { size: 0 };
      const numEvents = eventsSnapshot.size;
      const ageInDays = Math.floor((Date.now() - new Date(data.birthday).getTime()) / (1000 * 60 * 60 * 24));


      return {
        ...data,
        id: doc.id,
        dayzeCoins: 0, // Add this line to include DayzeCoins with a default value of 0
        numEvents,
        ageInDays,
      };
    }));

    setUserProfiles(profiles);

    const creationTimestamps = profiles.map(profile => profile.createdAt);
    setAccountCreationTimestamps(creationTimestamps);

    // Calculate statistics
    const numAccounts = profiles.length;
    const totalTimeSpent = profiles.reduce((acc, profile) => acc + (profile.timeSpent || 0), 0);
    const totalProfileCompletion = profiles.reduce((acc, profile) => acc + calculateProfileCompletion(profile), 0);

    setTotalAccounts(numAccounts);
    setAverageTimeSpent(numAccounts ? totalTimeSpent / numAccounts : 0);
    setAverageProfileCompletion(numAccounts ? totalProfileCompletion / numAccounts : 0);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id, newData) => {
    const db = getFirestore();
    const userProfileRef = doc(db, 'userProfiles', id);

    try {
      await updateDoc(userProfileRef, newData);
      fetchData();
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleDelete = async (id) => {
    const db = getFirestore();
    const userProfileRef = doc(db, 'userProfiles', id);

    try {
      await deleteDoc(userProfileRef);
      fetchData();
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }
  };


  const calculateProfileCompletion = (profile) => {
    // Add logic to calculate the completion percentage based on your app's requirements
    return 0; // Replace this line with the actual calculation
  };

  const updateUserProfilesWithAge = useCallback(() => {
    const now = new Date();
    const updatedProfiles = userProfiles.map((profile) => {
      const accountCreatedDateTime = new Date(profile.createdAt);
      const timeDiff = now - accountCreatedDateTime;

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      const accountAge = `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;

      return { ...profile, accountAge };
    });
    setUserProfilesWithAge(updatedProfiles);
  }, [userProfiles]);

  useEffect(() => {
    if (accountCreationTimestamps.length > 0) {
      const timer = setInterval(() => {
        updateUserProfilesWithAge();
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [accountCreationTimestamps, updateUserProfilesWithAge]);

  const columns = [

    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Profile Photo',
      dataIndex: 'profileImageUrl',
      key: 'profileImageUrl',
      render: (photoURL) => (
        <img src={photoURL} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'uid',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: 'Handle',
      dataIndex: 'handle',
      key: 'handle',
    },
    {
      title: 'DayzeCoins',
      dataIndex: 'dayzeCoins',
      key: 'dayzeCoins',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Age (Days)',
      dataIndex: 'ageInDays',
      key: 'ageInDays',
    },
    {
      title: 'Account Age (Days)',
      dataIndex: 'accountAge',
      key: 'accountAge',
    },
    {
      title: 'Current No. of Events',
      dataIndex: 'numEvents',
      key: 'numEvents',
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Total Time Spent (Minutes)',
      dataIndex: 'timeSpent',
      key: 'timeSpent',
    },
    {
      title: 'Update',
      key: 'update',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            // Add the logic to update user profile data
            const newData = { ...record, dayzeCoins: record.dayzeCoins + 1 };
            handleUpdate(record.id, newData);
          }}
        >
          Update
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user profile?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },

  ];

  return (
    <div className="admin-dashboard">
      <Title level={2}>Admin Dashboard</Title>
      <Card>
        <Descriptions title="Statistics" bordered>
          <Descriptions.Item label="Total Accounts">{totalAccounts}</Descriptions.Item>
          <Descriptions.Item label="Average Time Spent">{averageTimeSpent.toFixed(2)} minutes</Descriptions.Item>
          <Descriptions.Item label="Average Profile Completion">{(averageProfileCompletion * 100).toFixed(2)}%</Descriptions.Item>
        </Descriptions>
      </Card>


      {/* <Card title="User List" style={{ marginTop: 16, backgroundColor: "red" }}> */}
      <Table dataSource={userProfilesWithAge} columns={columns} rowKey="id" />

      {/* <Table  /> */}

      {/* </Card> */}
    </div>
  );
};

export default AdminDashboard;
