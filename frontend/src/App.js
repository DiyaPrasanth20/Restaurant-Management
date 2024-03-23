import React, { useState } from 'react';
import './App.css';
import imageOne from './images/imageOne.jpg';
import imageThree from './images/imageThree.jpg';

function App() {
  const [showReservationPrompt, setShowReservationPrompt] = useState(false);

  const handleAddReservationClick = () => {
    setShowReservationPrompt(true);
  };

  const handleYesButtonClick = () => {
    // Handle Yes button click
  };

  const handleNoButtonClick = () => {
    // Handle No button click
  };

  return (
    <div className="container">
      <div className="top-container">
        <img src={imageOne} alt="Image One" className="image-one" />
      </div>
      <div className="middle-container">
        <h2 className="welcome-text">Welcome to BooknDine!</h2>
        {!showReservationPrompt && (
          <div className="buttons">
            <button className="reservation-button" onClick={handleAddReservationClick}>Add Reservation</button>
            <button className="reservation-button">Delete/Modify Reservation</button>
          </div>
        )}
        {showReservationPrompt && (
          <div className="reservation-prompt">
            <h2>Do you know where you want to eat?</h2>
            <div className="buttons">
              <button className="reservation-button" onClick={handleYesButtonClick}>Yes</button>
              <button className="reservation-button" onClick={handleNoButtonClick}>No</button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-container">
        <img src={imageThree} alt="Image Three" className="image-three" />
      </div>
    </div>
  );
}

export default App;