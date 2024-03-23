import React from 'react';
import './FindRestaurantPage.css'; // Import the CSS file
import findResOne from './images/findResOne.jpg'; // Import the image file

const FindRestaurantPage = () => {
  return (
    <div className="find-restaurant-container"> {/* Use the class name from the CSS file */}
      <h1>Let's Find Your New Favorite Restaurant!</h1>
      {/* Add more content related to finding restaurants here */}
      <div className="image-wrapper">
        <img src={findResOne} alt="Find Restaurant One" />
        <div className="dropdown-container">
          <form className="restaurant-form">
            <div className="form-group">
              <label htmlFor="cuisine">Select Cuisine:</label>
              <select id="cuisine" name="cuisine">
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="indian">Indian</option>
                {/* Add more options as needed */}
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
