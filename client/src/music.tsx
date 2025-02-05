import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './music.css';

Modal.setAppElement('#root'); 

// Interface for props
interface MusicProps {
  searchQuery: string; // Search query string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Setter function for the query
}

const Music: React.FC<MusicProps> = ({ searchQuery, setSearchQuery }) => {
  const [musicData, setMusicData] = useState<any[]>([]); // State to store music data
  const [selectedSong, setSelectedSong] = useState<any | null>(null); // State for the selected song

  // Fetch music data from the backend
  // useEffect(() => {
  //   const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/music';
  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((data) => setMusicData(data))
  //     .catch((error) => console.error('Error fetching music data:', error));
  // }, []);
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/music';
  
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          cache: "no-store" // Ensure fresh data is fetched
        });
        const data = await response.json();
        setMusicData(data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  // Filter music data based on the searchQuery
  const filteredMusic = musicData.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="music-page">
      <h1>Music List</h1>

      {/* Display Filtered Music List */}
      <ul>
        {filteredMusic.map((song) => (
          <li key={song._id} onClick={() => setSelectedSong(song)}>
            <h2>{song.title}</h2>
            <p>Artist: {song.artist}</p>
            <p>Key: {song.key}</p>
          </li>
        ))}
      </ul>

      {/* Modal for Song Details */}
      {selectedSong && (
        <Modal
          isOpen={!!selectedSong}
          onRequestClose={() => setSelectedSong(null)}
          contentLabel="Song Details"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>{selectedSong.title}</h2>
          <p>Artist: {selectedSong.artist}</p>
          <p>Ratings: {selectedSong.ratings}</p>
          <p>Hits: {selectedSong.hits}</p>
          <p>Difficulty: {selectedSong.difficulty}</p>
          <p>Page Type: {selectedSong.pageType}</p>
          <p>Key: {selectedSong.key}</p>
          <p>Capo: {selectedSong.capo}</p>
          <p>Tuning: {selectedSong.tuning}</p>
          <button onClick={() => setSelectedSong(null)}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default Music;
