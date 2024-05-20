import React, {useState, ChangeEvent} from 'react'
import { Link } from 'react-router-dom'; 

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void  => {
    //e.preventDefault();
    setSearchTerm(e.target.value);
  };

  return (
    <div className='navbar-item'>
      <div className='ml'>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      </div>

      <div className='ml'>
      <Link to={`/search-results?query=${searchTerm}`}>
        <button>Search</button>
      </Link>
      </div>
    </div>
  );
};

export default SearchBar;
