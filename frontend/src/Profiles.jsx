import React, { useState, useEffect } from "react";
import api from "./api"; // 🚀 Clean custom configured API instance
import "./Profiles.css";

function Profiles({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const avatarOptions = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg",
    "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-2vbhg799vba882is.jpg"
  ];

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // ✅ FIXED: Using api instance instead of unimported axios
      const response = await api.get('/api/profiles');
      setProfiles(response.data);
    } catch (err) {
      console.error("Error fetching profiles:", err.response?.data || err.message);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    try {
      const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

      // ✅ FIXED: Using api instance instead of unimported axios
      const response = await api.post('/api/profiles/add', { 
        name: newProfileName, 
        avatar: randomAvatar 
      });

      setProfiles(response.data);
      setNewProfileName('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error creating profile:", err.response?.data || err.message);
    }
  };

  return (
    <div className="profilesScreen">
      <div className="profilesScreen__container">
        <h1>Who's watching?</h1>
        
        <div className="profilesScreen__gate">
          {profiles.map((profile) => (
            <div 
              key={profile._id} 
              className="profilesScreen__profile"
              onClick={() => onSelectProfile(profile)}
            >
              <img src={profile.avatar} alt={profile.name} />
              <span>{profile.name}</span>
            </div>
          ))}

          {profiles.length < 5 && !showAddForm && (
            <div className="profilesScreen__profile add" onClick={() => setShowAddForm(true)}>
              <div className="profilesScreen__addIcon">+</div>
              <span>Add Profile</span>
            </div>
          )}
        </div>

        {showAddForm && (
          <form className="profilesScreen__form" onSubmit={handleCreateProfile}>
            <input 
              type="text" 
              placeholder="Profile Name" 
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              maxLength="12"
              required
            />
            <div className="profilesScreen__buttons">
              <button type="submit" className="save">Save</button>
              <button type="button" className="cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profiles;