import React, { useState, useEffect } from 'react';
import './BookPage.css'; // Import the CSS file
import backgroundImage from './images/findResOne.jpg'; // Import the background image

function BookPage() {
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [dates, setDates] = useState([]);

  useEffect(() => {
    fetchRestaurantNames();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchDates(selectedRestaurant);
    }
  }, [selectedRestaurant]);

  const fetchRestaurantNames = () => {
    fetch('/restaurant_names')
      .then(response => response.json())
      .then(data => setRestaurantNames(data))
      .catch(error => console.error('Error fetching restaurant names:', error));
  };

  const fetchDates = (restaurantName) => {
    fetch(`/dates?restaurant_name=${restaurantName}`)
      .then(response => response.json())
      .then(data => setDates(data))
      .catch(error => console.error('Error fetching dates:', error));
  };

  const handleRestaurantChange = (event) => {
    setSelectedRestaurant(event.target.value);
  };

  return (
    <div className="book-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-wrapper">
        <h1>Book Your Reservation</h1>
        <div className="form-group">
          <label htmlFor="restaurantName">Select Restaurant:</label>
          <select id="restaurantName" name="restaurantName" onChange={handleRestaurantChange}>
            <option value="">Select Restaurant</option>
            {restaurantNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <select id="date" name="date">
            <option value="">Select Date</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        {/* Add other content here */}
      </div>
    </div>
  );
}

export default BookPage;
