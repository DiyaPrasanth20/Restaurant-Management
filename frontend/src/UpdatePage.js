import React, { useState } from 'react';
import './UpdatePage.css';
import backgroundImage from './images/findResOne.jpg';

function UpdatePage() {
  const [showModal, setShowModal] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const handleDelete = () => {
    setShowModal(true);  // Show the modal when delete is clicked
  };

  const closeModal = () => {
    setShowModal(false);  // Hide the modal
  };

  return (
    <div className="find-restaurant-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-wrapper">
        <h1>Would you like to modify or delete your reservation?</h1>
        <div className="button-container">
          <button className="update-button">Update</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
        {showModal && <Modal onClose={closeModal} reservationCode={reservationCode} setReservationCode={setReservationCode} />}
      </div>
    </div>
  );
}

function Modal({ onClose, reservationCode, setReservationCode }) {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleInputChange = (event) => {
    const input = event.target.value;
    // Regex to ensure only numeric input is accepted
    if (/^\d*$/.test(input)) {
      setReservationCode(input);
    }
  };

  const confirmDeletion = async () => {
    if (reservationCode) {
        try {
            const response = await fetch(`/delete-reservation/${reservationCode}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                setIsDeleted(true);
            } else {
                throw new Error(data.error || 'Failed to delete reservation');
            }
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('Please enter a valid reservation code.');
    }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Please enter your reservation code:</h2>
        <input
          type="text"
          placeholder="Reservation Code"
          value={reservationCode}
          onChange={handleInputChange}
          className="reservation-input"
        />
        {!isDeleted && (
          <button onClick={confirmDeletion}>Confirm Deletion</button>
        )}
        {isDeleted && (
          <>
            <h2>Your reservation has been deleted.</h2>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}

export default UpdatePage;
