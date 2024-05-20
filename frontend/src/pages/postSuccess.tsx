import React from 'react';
import { Link } from 'react-router-dom'; 
import NavigationBar from '../components/navigationBar'; 

const PostUploadSuccessPage: React.FC = () => {
  return (
    <div> 
      <NavigationBar /> 
      <h1>Post Uploaded Successfully!</h1>
      <div className='con'>
        <Link to="/home"> 
          <button>Go to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default PostUploadSuccessPage;
