import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DisplayPost: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      const notes = JSON.parse(storedNotes);
      const selectedPostIndex = localStorage.getItem('selectedPostIndex');
      if (selectedPostIndex !== null) {
        setSelectedPost(notes[parseInt(selectedPostIndex)]);
      }
    }
  }, []);

  const handleDownload = async () => {
    if (selectedPost && selectedPost.file_id) {
      try {
        const response = await axios.get(`/download/${selectedPost.file_id}`, {
          responseType: 'blob', 
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  return (
    <div>
      {selectedPost && (
        <div>
          <h1>{selectedPost.title}</h1>
          <p>{selectedPost.content}</p>
          <button onClick={handleDownload}>Download File</button>
        </div>
      )}
    </div>
  );
};

export default DisplayPost;
