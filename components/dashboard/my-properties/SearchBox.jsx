import { FaSearch, FaLightbulb } from 'react-icons/fa';

const SearchBox = ({ onSearch }) => {
  const handleInputChange = (e) => {
    const query = e.target.value;
    onSearch(query);
  };

  return (
    <div className="modern-search-container">
      <div className="search-wrapper">
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          className="modern-search-input"
          type="search"
          placeholder="Caută în titlu, conținut sau nume afișare..."
          aria-label="Căutare în documente BICP"
          onChange={handleInputChange}
        />
        <div className="search-hint">
          <span><FaLightbulb /> Tip: caută rapid după cuvinte cheie</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
