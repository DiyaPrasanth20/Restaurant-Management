import React, { useState, useEffect } from 'react';
import './FindRestaurantPage.css'; 
import findResOne from './images/findResOne.jpg'; 

const FindRestaurantPage = () => {
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxPriceError, setMaxPriceError] = useState('');
  const [matchingRestaurants, setMatchingRestaurants] = useState([]);
  const [noMatchesFound, setNoMatchesFound] = useState(false);

  useEffect(() => {
    fetch('/cuisine_types')
      .then(response => response.json())
      .then(data => setCuisineTypes(data))
      .catch(error => console.error('Error fetching cuisine types:', error));
  }, []);

  useEffect(() => {
    fetch('/locations')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isNaN(maxPrice) && maxPrice >= 0) {
      fetch(`/restaurants?cuisine=${selectedCuisine}&max_price=${maxPrice}&city=${selectedLocation}`)
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            setNoMatchesFound(true);
          } else {
            setNoMatchesFound(false);
          }
          setMatchingRestaurants(data);
        })
        .catch(error => console.error('Error fetching matching restaurants:', error));
      setMaxPriceError('');
    } else {
      setMaxPriceError('Enter a positive number');
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (value === '' || (!isNaN(value) && value >= 0)) {
      setMaxPrice(value);
    }
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
              <label htmlFor="location">Select Location:</label>
               <select id="location" name="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">Select Location</option>
                {locations.map(location => (
                <option key={location} value={location}>{location}</option>
                ))}
                </select>
                </div>
            <div className="form-group">
              <label htmlFor="maxPrice">Max Budget ($):</label>
              <input 
                type="text" 
                id="maxPrice" 
                name="maxPrice" 
                value={maxPrice} 
                onChange={handleInputChange} 
              />
              {maxPriceError && <div className="error-message">{maxPriceError}</div>}
            </div>
            <button type="submit">Submit</button>
          </form>
          {noMatchesFound && <div className="no-matches">No matches found!</div>}
          {matchingRestaurants.length > 0 && (
            <div>
              <h2>Bon Appétit! Here are {matchingRestaurants.length} options for you:</h2>
              <ul>
                {matchingRestaurants.map(restaurant => (
                  <li key={restaurant.name}>
                    {restaurant.name} - {restaurant.city} - Rating: {restaurant.rating} - Dress Code: {restaurant.dress_code}
                  </li>
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
