import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

const baseUrl = process.env.URL || 'http://localhost:8000/';

const OCR = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [boldWords, setBoldWords] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming initially logged in
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
    }
  }, [token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(baseUrl + 'api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      setExtractedText(response.data.extracted_text);
      setBoldWords(response.data.bold_words);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(baseUrl + 'api/logout/', {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      localStorage.removeItem('token'); // Remove token from localStorage
      setIsLoggedIn(false); // Set logged in state to false
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  return (
    <div className="ocr-container">
      <h2>OCR</h2>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {extractedText && (
        <div className="ocr-results">
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>
          <h3>Bold Words:</h3>
          <p>{boldWords}</p>
        </div>
      )}
    </div>
  );
};

export default OCR;
