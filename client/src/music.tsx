import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './music.css';
import API_BASE_URL from "./config";

Modal.setAppElement('#root'); // Accessibility requirement for modals

interface MusicProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Music: React.FC<MusicProps> = ({ searchQuery, setSearchQuery }) => {
  // State to store all fetched music
  const [musicData, setMusicData] = useState<any[]>([]);
  // State for selected song to show in modal
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  // Pagination control
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<string | null>(null);
  const [keyFilter, setKeyFilter] = useState('');
  const [capoFilter, setCapoFilter] = useState<string | null>(null);

  // Fetch music data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/music`, {
          cache: "no-store" // prevent caching to always get the latest
        });
        const data = await response.json();
        setMusicData(data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter music based on search query and filters
  const filteredMusic = musicData.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = !difficultyFilter || song.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesFormat = !formatFilter || song.pageType?.toLowerCase() === formatFilter.toLowerCase();
    const matchesKey = !keyFilter || song.key?.toLowerCase().includes(keyFilter.toLowerCase());
    const capoText = (song.capo || '').toLowerCase();
    const matchesCapo =
      !capoFilter ||
      (capoFilter === 'Yes'
        ? /(capo|fre)/.test(capoText) && !capoText.includes('no')
        : capoText.includes('no') || capoText === '' || !/(capo|fre)/.test(capoText));//handles missmatch due to dataset having errors
    
    return matchesSearch && matchesDifficulty && matchesFormat && matchesKey && matchesCapo;
  });

  // Pagination calculations
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredMusic.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages = Math.ceil(filteredMusic.length / songsPerPage);

  // Generate pagination page numbers with ellipses
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let last = 0;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last) {
        if (i as number - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i as number - last !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      last = i as number;
    }

    return rangeWithDots;
  };

  return (
    <div className="music-page">
      {/* Filters toggle and controls */}
      <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>Filters</button>

      <div className={`filters-wrapper ${showFilters ? 'open' : ''}`}>
        <div className="filters-container">
          <div>
            <label>Difficulty:</label>
            <select value={difficultyFilter || ''} onChange={(e) => setDifficultyFilter(e.target.value || null)}>
              <option value="">All</option>
              <option value="Novice">Novice</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label>Format (Page Type):</label>
            <select value={formatFilter || ''} onChange={(e) => setFormatFilter(e.target.value || null)}>
              <option value="">All</option>
              <option value="Tab">Tabs</option>
              <option value="Chords">Chords</option>
            </select>
          </div>

          <div>
            <label>Key:</label>
            <input
              type="text"
              value={keyFilter}
              onChange={(e) => setKeyFilter(e.target.value)}
              placeholder="Type key..."
            />
          </div>

          <div>
            <label>Capo:</label>
            <select value={capoFilter || ''} onChange={(e) => setCapoFilter(e.target.value || null)}>
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      
      {/* List of music items */}
      <ul>
        {currentSongs.map((song) => (
          <li key={song._id} onClick={() => setSelectedSong(song)}>
            <h2>{song.title}</h2>
            <p>Artist: {song.artist}</p>
            <p>Key: {song.key}</p>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div style={{ textAlign: 'center', marginTop: '20px', flexWrap: 'wrap', display: 'flex', justifyContent: 'center' }}>
        {getPageNumbers().map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              style={{
                margin: '4px',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: currentPage === page ? '#5e3b9b' : '#4d3577',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ) : (
            <span key={idx} style={{ margin: '6px 10px', color: '#ccc' }}>{page}</span>
          )
        )}
      </div>

      {/* Modal to show song details */}
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
