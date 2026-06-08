import React, { useState, useEffect } from 'react';
import './Nav.css';

function Nav({ currentProfile, onLogOutProfile, searchQuery, setSearchQuery }) {
  const [show, handleShow] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__leftSide">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          onClick={() => {
            setSearchQuery(""); // Clear search to return home
            onLogOutProfile();
          }}
        />
        
        {/* NEW: Netflix Style Search Input Element Box */}
        <div className="nav__searchBox">
          <input 
            type="text" 
            placeholder="Titles, people, genres..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div 
        className="nav__profileContainer"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <img
          className="nav__avatar"
          src={currentProfile?.avatar}
          alt={currentProfile?.name}
        />
        
        {dropdownOpen && (
          <div className="nav__dropdown">
            <div className="nav__dropdownItem profileName">
              Hi, {currentProfile?.name}
            </div>
            <hr />
            <div className="nav__dropdownItem" onClick={() => { setSearchQuery(""); onLogOutProfile(); }}>
              Switch Profiles
            </div>
            <div className="nav__dropdownItem" onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}>
              Sign Out of Netflix
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;