import React, { useState, useEffect } from 'react';
import './BookPage.css';
import backgroundImage from './images/findResOne.jpg'; 

function BookPage() {
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [occasion, setOccasion] = useState(''); 
  const [reservationMessage, setReservationMessage] = useState('');

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
    setSelectedDate(''); 
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleOccasionChange = (event) => {
    setOccasion(event.target.value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(occasion);
    if (selectedRestaurant && selectedDate) {
      fetch(`/book-table?restaurant_name=${selectedRestaurant}&date=${selectedDate}&occasion=${occasion}`, {
        method: 'PUT',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Table booked successfully!');
            if (data.reservation_code !== undefined) {
              console.log(data.reservation_code);
            } else {
              console.error('Reservation code is missing or undefined');
            }
            setReservationMessage(`Your reservation code is ${data.reservation_code}. Have a great time!`);
          } else {
            console.error('Failed to book table:', data.error);
          }
        })
        .catch(error => console.error('Error booking table:', error));
    } else {
      console.error('Please select both restaurant, date, and specify an occasion.');
    }
  };

  return (
    <div className="book-page-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-wrapper">
        <h1>Book Your Reservation</h1>
        <form onSubmit={handleSubmit}>
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
            <select id="date" name="date" onChange={handleDateChange}>
              <option value="">Select Date</option>
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="occasion">Occasion:</label>
            <input type="text" id="occasion" name="occasion" value={occasion} onChange={handleOccasionChange} placeholder="Leave blank if none" />
          </div>
          <button type="submit">Book Now!</button>
        </form>
        {reservationMessage && <p>{reservationMessage}</p>}
        {}
      </div>
    </div>
  );
}

export default BookPage;
