import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SignUpPage from './SignUpPage';
import SuccessScreen from './SuccessScreen';
import EditProfile from './EditProfile';
import PublicProfile from './PublicProfile';
import AdminDashboardWrapper from './AdminDashboardWrapper';
import AdminDashboard from './screens/dashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/:handle" element={<PublicProfile />} />
        <Route path="/sd" element={<AdminDashboardWrapper />} />
        <Route path="/dashboard" element={<AdminDashboard />} />



      </Routes>
    </Router>
  );
}

export default App;
