import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/navigationBar';

const AddFavorite: React.FC = () => {
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFavorite = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError('User is not logged in.');
      return;
    }

    if (!courseId) {
      setError('Please enter a course ID.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/add_favorite', {
        "user_id": username,
        "course_id": courseId
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error adding course to favorites:', error);
      setError('Failed to add course to favorites.');
    }
    setLoading(false);
  };

  return (
    <div>
        <NavigationBar />
      <h2>Add Course to Favorites</h2>
      <input
        type="text"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        placeholder="Enter Course ID"
      />
      <button className='padb' onClick={handleAddFavorite} disabled={loading}>
        Add to Favorites
      </button>
      
      {error && <p>{error}</p>}

      <div className='con'>
        <Link to="/home">
          <button>Go to Home</button> 
        </Link>
      </div>
    </div>
  );
};

export default AddFavorite;
