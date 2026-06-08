import React, { useState } from 'react';
import Row from './Row';
import Banner from './Banner';
import Nav from './Nav';
import Login from './Login';
import Profiles from './Profiles';
import SearchPage from './SearchPage'; // Import your new search component
import requests from './requests';

function App() {
  const token = localStorage.getItem('token');
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Shared search query state

  if (!token) return <Login />;
  if (!currentProfile) return <Profiles onSelectProfile={(p) => setCurrentProfile(p)} />;

  return (
    <div className="app">
      {/* Pass search state modifiers down to the navbar layout box */}
      <Nav 
        currentProfile={currentProfile} 
        onLogOutProfile={() => setCurrentProfile(null)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Conditional Rendering: Show SearchPage if user typed something, otherwise default home view */}
      {searchQuery ? (
        <SearchPage query={searchQuery} />
      ) : (
        <>
          <Banner />
          <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow={true} />
          <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
          <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
          <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
          <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
          <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
          <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
          <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
        </>
      )}
    </div>
  );
}

export default App;