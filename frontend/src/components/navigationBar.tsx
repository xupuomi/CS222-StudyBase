import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import SearchBar from './searchBar';
import './navigationBar.css';

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home" className="navbar-item sblink">StudyBase</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item">
            <SearchBar />
          </div>
          <div className="navbar-item">
            <Link to="/add-favorite" className="button is-primary">
              <span className="icon">
                <i className="fas fa-star" style={{ color: 'white' }}></i>
              </span>
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/posts" className="navbar-item sblink">Upload</Link>
          </div>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <button className="button is-info">Notifications</button>
          </div>
          <div className="navbar-item">
            <button className="button is-info">Profile</button>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    </nav>
  );
};

export default NavigationBar;