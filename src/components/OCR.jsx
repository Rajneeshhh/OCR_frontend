import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './OCR.css';

const baseUrl = process.env.URL || 'http://localhost:8000/';

const OCR = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [boldWords, setBoldWords] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

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
        },
      });
      const extractedText = response.data.extracted_text;
      const boldWordsArray = response.data.bold_words.split(/\s+/);
      setExtractedText(extractedText);
      setBoldWords(boldWordsArray);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error uploading image. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const cookies = new Cookies();
      const token = cookies.get('token');
      await axios.post(
        baseUrl + 'api/logout/',
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      cookies.remove('token');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      setErrorMessage('Error logging out. Please try again.');
    }
  };

  const normalize = (text) => {
    return text.toLowerCase().replace(/[^\w\s]/g, '');
  };

  const renderText = () => {
    const boldSet = new Set(boldWords.map(normalize));
    const lines = extractedText.split('\n');
    
    return lines.map((line, index) => (
      <p key={index}>
        {line.split(/\s+/).map((word, index) => (
          <span key={index} style={{ fontWeight: boldSet.has(normalize(word)) ? 'bold' : 'normal' }}>
            {word}{' '}
          </span>
        ))}
        <br/>
      </p>
    ));
  };

  return (
    <div className="ocr-container">
      <h2>OCR</h2>
      <div className="upload-section">
        <h3>Upload Image:</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="ocr-content">
        <div className="ocr-upload">
          {image && (
            <img src={URL.createObjectURL(image)} alt="Uploaded" className="uploaded-image" />
          )}
        </div>
        <div className="ocr-result">
          {extractedText && <h3>Extracted Text:</h3>}
          <div>{renderText()}</div>
        </div>
      </div>
    </div>
  );
};

export default OCR;
