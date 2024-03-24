import React, { useState, useEffect } from 'react';
import './FindRestaurantPage.css'; // Import the CSS file
import findResOne from './images/findResOne.jpg'; // Import the image file

const FindRestaurantPage = () => {
const [cuisineTypes, setCuisineTypes] = useState([]);


  useEffect(() => {
    fetch('/cuisine_types')
      .then(response => response.json())
      .then(data => setCuisineTypes(data))
      .catch(error => console.error('Error fetching cuisine types:', error));
  }, []);



  return (
    <div className="find-restaurant-container">
      <h1>Let's Find Your New Favorite Restaurant!</h1>
      <div className="image-wrapper">
        <img src={findResOne} alt="Find Restaurant One" />
        <div className="dropdown-container">
          <form className="restaurant-form">
            <div className="form-group">
              <label htmlFor="cuisine">Select Cuisine:</label>
              <select id="cuisine" name="cuisine">
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
            {/* Add more form fields as needed */}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindRestaurantPage;
