import NavigationBar from '../components/navigationBar';
import React, { useState, useEffect } from 'react';
import './homePage.css';
import axios from 'axios';

const HomePage = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [favoriteCourses, setFavoriteCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) {
          throw new Error('Username not found in localStorage');
        }
        
        const responseFavorites = await axios.get(`http://127.0.0.1:5000/get_favorites/${username}`);
        const { favorite_courses } = responseFavorites.data;
        setFavoriteCourses(favorite_courses);

        const responseFiles = await axios.get(`http://127.0.0.1:5000/get_file_ids/${username}`);
        const { file_ids } = responseFiles.data;

        const notesWithFiles = await Promise.all(file_ids.map(async (file_id: string) => {
          try {
            const responsePdf = await axios.get(`http://127.0.0.1:5000/get_pdf/${file_id}`, {
              responseType: 'blob'
            });
            return { file: file_id, fileData: responsePdf.data };
          } catch (error) {
            console.error(`Error fetching PDF for file ID ${file_id}:`, error);
            return null;
          }
        }));

        setNotes(notesWithFiles.filter((note) => note !== null));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete/${fileId}`);
      setNotes(notes.filter(note => note.file !== fileId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="home-page">
      <NavigationBar />

      <div className="content">
        <div className="left-column">
          <h2>Newest Notes</h2>
          <div className="note-container">
            {notes.map((note: any, index: number) => (
              <div className="note" key={index}>
                <embed src={URL.createObjectURL(note.fileData)} type="application/pdf" width="100%" height="500" />
                <span>{note.file}</span>
                <button className="padb" onClick={() => handleDelete(note.file)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="right-column">
          <h2>My Courses</h2>
          <div className="course-container">
            {favoriteCourses.map((course: string, index: number) => (
              <div className="course" key={index}>{course}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

