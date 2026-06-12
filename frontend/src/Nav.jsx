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
          src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Aha_OTT_Logo.svg"
          alt="aha Logo"
          onClick={() => {
            setSearchQuery(""); // Clear search to return home
            onLogOutProfile();
          }}
        />
        
        {/* NEW: aha Style Search Input Element Box */}
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
              Switch
            </div>
            <div className="nav__dropdownItem" onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}>
              Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;