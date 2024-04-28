import React, { useState } from 'react';
import './App.css';
import imageOne from './images/imageOne.jpg';
import imageThree from './images/imageThree.jpg';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FindRestaurantPage from './FindRestaurantPage';
import BookPage from './BookPage';
import UpdatePage from './UpdatePage'; // Import UpdatePage component

function App() {
  const [showReservationPrompt, setShowReservationPrompt] = useState(false);

  const handleAddReservationClick = () => {
    setShowReservationPrompt(true);
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <>
              <div className="top-container">
                <img src={imageOne} alt="Image One" className="image-one" />
              </div>
              <div className="middle-container">
                <h2 className="welcome-text">Welcome to BooknDine!</h2>
                {!showReservationPrompt && (
                  <div className="buttons">
                    <button className="reservation-button" onClick={handleAddReservationClick}>
                      Add Reservation
                    </button>
                    <Link to="/update-reservation">
                      <button className="reservation-button">
                        Delete/Modify Reservation
                      </button>
                    </Link>
                  </div>
                )}
                {showReservationPrompt && (
                  <div className="reservation-prompt">
                    <h2>Do you know where you want to eat?</h2>
                    <div className="buttons">
                      <Link to="/book-page">
                        <button className="reservation-button">Yes</button>
                      </Link>
                      <Link to="/find-restaurant">
                        <button className="reservation-button">No</button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="bottom-container">
                <img src={imageThree} alt="Image Three" className="image-three" />
              </div>
            </>
          } />
          <Route path="/find-restaurant" element={<FindRestaurantPage />} />
          <Route path="/book-page" element={<BookPage />} />
          <Route path="/update-reservation" element={<UpdatePage />} /> {/* Route for UpdatePage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
