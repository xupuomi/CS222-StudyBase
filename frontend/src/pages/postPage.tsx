import React, { useState, useRef } from 'react';
import NavigationBar from '../components/navigationBar';
import axios from 'axios';

const PostPage: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [CRN, setCRN] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };  

  const handleCRNChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCRN(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const username = localStorage.getItem('username');
      const postUrl = `http://127.0.0.1:5000/upload/${username}/${CRN}`;

      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file_id', file);

      const response = await axios.post(postUrl, formData);

      console.log('upload success', response);
      window.location.href = '/successful-upload';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <h1>Create Post</h1>
      <div>
        <label>
          CRN:
          <textarea value={CRN} onChange={handleCRNChange} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={handleDescriptionChange} />
        </label>
        <label>
          File:
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>
      <div>
        <button type="button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PostPage;
