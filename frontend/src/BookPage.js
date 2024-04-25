import React, { useState, useEffect } from 'react';
import './BookPage.css'; // Import the CSS file
import backgroundImage from './images/findResOne.jpg'; // Import the background image

function BookPage() {
  const [restaurantNames, setRestaurantNames] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
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
    setSelectedDate(''); // Reset selected date when restaurant changes
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedRestaurant && selectedDate) {
      // Make API request to update num_tables_open
      fetch(`/book-table?restaurant_name=${selectedRestaurant}&date=${selectedDate}`, {
        method: 'PUT',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Make API request to create a new reservation
            fetch(`/create-reservation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                restaurant_name: selectedRestaurant,
                booking_date: selectedDate,
              }),
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  // Handle success
                  console.log('Reservation created successfully!');
                  setReservationMessage(`Your reservation code is ${data.reservation_code}. Have a great time!`);
                } else {
                  // Handle error
                  console.error('Failed to create reservation:', data.error);
                }
              })
              .catch(error => console.error('Error creating reservation:', error));
          } else {
            // Handle error
            console.error('Failed to book table:', data.error);
          }
        })
        .catch(error => console.error('Error booking table:', error));
    } else {
      // Handle error, both restaurant and date must be selected
      console.error('Please select both restaurant and date.');
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
          <button type="submit">Book Now!</button>
        </form>
        {reservationMessage && <p>{reservationMessage}</p>}
        {/* Add other content here */}
      </div>
    </div>
  );
}

export default BookPage;
