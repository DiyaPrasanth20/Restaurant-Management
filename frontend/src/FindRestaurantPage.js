import React, { useState, useEffect } from 'react';
import './FindRestaurantPage.css'; // Import the CSS file
import findResOne from './images/findResOne.jpg'; // Import the image file

const FindRestaurantPage = () => {
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [maxPrice, setMaxPrice] = useState(''); // State to store the maximum price
  const [matchingRestaurants, setMatchingRestaurants] = useState([]);

  useEffect(() => {
    fetch('/cuisine_types')
      .then(response => response.json())
      .then(data => setCuisineTypes(data))
      .catch(error => console.error('Error fetching cuisine types:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`/restaurants?cuisine=${selectedCuisine}&max_price=${maxPrice}`) // Include max_price in the fetch URL
      .then(response => response.json())
      .then(data => setMatchingRestaurants(data))
      .catch(error => console.error('Error fetching matching restaurants:', error));
  };

  return (
    <div className="find-restaurant-container">
      <h1>Let's Find Your New Favorite Restaurant!</h1>
      <div className="image-wrapper">
        <img src={findResOne} alt="Find Restaurant One" />
        <div className="dropdown-container">
          <form className="restaurant-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cuisine">Select Cuisine:</label>
              <select id="cuisine" name="cuisine" onChange={(e) => setSelectedCuisine(e.target.value)}>
                <option value="">Select Cuisine</option>
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="maxPrice">Max Price ($):</label> {/* Add label for max price input */}
              <input type="number" id="maxPrice" name="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /> {/* Input field for max price */}
            </div>
            <button type="submit">Submit</button>
          </form>
          {matchingRestaurants.length > 0 && (
            <div>
              <h2>Matching Restaurants:</h2>
              <ul>
                {matchingRestaurants.map(restaurant => (
                  <li key={restaurant.name}>{restaurant.name} - {restaurant.city}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRestaurantPage;
