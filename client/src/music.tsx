// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import './music.css';
// Modal.setAppElement('#root'); 
// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/music';

// // Props interface to receive the searchQuery and setSearchQuery from App
// interface MusicProps {
//   searchQuery: string; // Prop for the search query string
//   setSearchQuery: React.Dispatch<React.SetStateAction<string>>; // Prop for the setter function
// }


// const Music: React.FC<MusicProps> = ({searchQuery, setSearchQuery}) => {
//   const [musicData, setMusicData] = useState<any[]>([]);
//   const [selectedSong, setSelectedSong] = useState<any | null>(null);

//   // const [searchQuery, setSearchQuery] = useState<string>('');  //search query logic
  
// //   useEffect(() => {
// //     fetch('http://localhost:5000/api/music')
// //       .then((response) => response.json())
// //       .then((data) => setMusicData(data));
// //   }, []);

//   useEffect(() => {
//     fetch(apiUrl) // local and deployed URLs
//       .then((response) => response.json())
//       .then((data) => setMusicData(data))
//       .catch((error) => console.error('Error fetching music data:', error));
//   }, []);

//   //filter music data based on search query 
//   const filteredMusic = musicData.filter((song) =>
//   song.title.toLowerCase().includes(searchQuery.toLowerCase()) || // search by title
//   song.artist.toLowerCase().includes(searchQuery.toLowerCase())  // search by artist
// );

// //   return (
// //     <div>
// //       <h1>Music List</h1>
// //       <ul>
// //         {musicData.map((song) => (
// //           <li key={song._id} onClick={() => setSelectedSong(song)}>
// //             <h2>{song.title}</h2>
// //             <p>Artist: {song.artist}</p>
// //           </li>
// //         ))}
// //       </ul>

// //       {selectedSong && (
// //         <Modal isOpen={!!selectedSong} onRequestClose={() => setSelectedSong(null)}>
// //           <h2>{selectedSong.title}</h2>
// //           <p>Artist: {selectedSong.artist}</p>
// //           <p>Difficulty: {selectedSong.difficulty}</p>
// //           <button onClick={() => setSelectedSong(null)}>Close</button>
// //         </Modal>
// //       )}
// //     </div>
// //   );

// return (
//     // <div className="music-page"> {/* Scoped container */}
//     //   <h1>Music List</h1>
//     //   <ul>
//     //     {musicData.map((song) => (
//     //       <li key={song._id} onClick={() => setSelectedSong(song)}>
//     //         <h2>{song.title}</h2>
//     //         <p>Artist: {song.artist}</p>
//     //       </li>
//     //     ))}
//     //   </ul>

//     //   {selectedSong && (
//     //     <Modal
//     //       isOpen={!!selectedSong}
//     //       onRequestClose={() => setSelectedSong(null)}
//     //       contentLabel="Song Details"
//     //       className="modal" // Scoped class for styling the modal
//     //       overlayClassName="modal-overlay" // Scoped overlay styles
//     //     >
//     //       <h2>{selectedSong.title}</h2>
//     //       <p>Artist: {selectedSong.artist}</p>
//     //       <p>Ratings: {selectedSong.ratings}</p>
//     //       <p>Hits: {selectedSong.hits}</p>
//     //       <p>Difficulty: {selectedSong.difficulty}</p>
//     //       <p>Page Type: {selectedSong.pageType}</p>
//     //       <p>Key: {selectedSong.key}</p>
//     //       <p>Capo: {selectedSong.capo}</p>
//     //       <p>Tuning: {selectedSong.tuning}</p>
//     //       <button onClick={() => setSelectedSong(null)}>Close</button>
//     //     </Modal>
//     //   )}
//     // </div> old version

//   <div className="music-page">
//       <h1>Music List</h1>

//       {/* Display Filtered Music List */}
//       <ul>
//         {filteredMusic.map((song) => (
//           <li key={song._id} onClick={() => setSelectedSong(song)}>
//             <h2>{song.title}</h2>
//             <p>Artist: {song.artist}</p>
//           </li>
//         ))}
//       </ul>

//       {/* Modal for Song Details */}
//       {selectedSong && (
//         <Modal
//           isOpen={!!selectedSong}
//           onRequestClose={() => setSelectedSong(null)}
//           contentLabel="Song Details"
//           className="modal"
//           overlayClassName="modal-overlay"
//         >
//           <h2>{selectedSong.title}</h2>
//           <p>Artist: {selectedSong.artist}</p>
//           <p>Ratings: {selectedSong.ratings}</p>
//           <p>Hits: {selectedSong.hits}</p>
//           <p>Difficulty: {selectedSong.difficulty}</p>
//           <p>Page Type: {selectedSong.pageType}</p>
//           <p>Key: {selectedSong.key}</p>
//           <p>Capo: {selectedSong.capo}</p>
//           <p>Tuning: {selectedSong.tuning}</p>
//           <button onClick={() => setSelectedSong(null)}>Close</button>
//         </Modal>
//       )}
//   </div>
//   );
// };


// export default Music; -------workingggggg


// const Music: React.FC = () => {
//   const [musicData, setMusicData] = useState<any[]>([]);

//   // Fetch data from the backend
//   useEffect(() => {
//     fetch('/api/music') // Replace with your deployed backend URL if applicable
//       .then((response) => response.json())
//       .then((data) => setMusicData(data))
//       .catch((error) => console.error('Error fetching music data:', error));
//   }, []);

//   return (
//     <div>
//       <h1>Music List</h1>
//       {musicData.length === 0 ? (
//         <p>Loading...</p>
//       ) : (
//         <ul>
//           {musicData.map((song) => (
//             <li key={song._id}>
//               <h2>{song.title}</h2>
//               <p>Artist: {song.artist}</p>
//               <p>Ratings: {song.ratings}</p>
//               <p>Hits: {song.hits}</p>
//               <p>Difficulty: {song.difficulty}</p>
//               <p>Page Type: {song.pageType}</p>
//               <p>Key: {song.key}</p>
//               <p>Capo: {song.capo}</p>
//               <p>Tuning: {song.tuning}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Music;


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
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/music';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setMusicData(data))
      .catch((error) => console.error('Error fetching music data:', error));
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
