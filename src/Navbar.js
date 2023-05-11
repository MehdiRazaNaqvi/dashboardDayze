import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

import logo from './assets/images/dayze-logo.svg';


const Navbar = () => {
    return (
            <div className="navbar">
                <div className="navbar-logo">
                    <Link to="/home">
                        <img src={logo} alt="Dayze Logo" />
                    </Link>
                </div>
                <div className="navbar-menu">
                    <Link to="/edit-profile">Edit Profile</Link>
                </div>
            </div>
    );
};

export default Navbar;

