import React, { useState } from 'react';
import './UpdatePage.css';
import backgroundImage from './images/findResOne.jpg';

function UpdatePage() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const handleUpdate = () => {
    setShowUpdateModal(true);  // Show the update modal when update is clicked
  };

  const handleDelete = () => {
    setShowDeleteModal(true);  // Show the delete modal when delete is clicked
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);  // Hide the update modal
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);  // Hide the delete modal
  };

  return (
    <div className="find-restaurant-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content-wrapper">
        <h1>Would you like to modify or delete your reservation?</h1>
        <div className="button-container">
          <button className="update-button" onClick={handleUpdate}>Update</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
        {showUpdateModal && <Modal onClose={closeUpdateModal} action="update" reservationCode={reservationCode} setReservationCode={setReservationCode} />}
        {showDeleteModal && <Modal onClose={closeDeleteModal} action="delete" reservationCode={reservationCode} setReservationCode={setReservationCode} />}
      </div>
    </div>
  );
}

function Modal({ onClose, action, reservationCode, setReservationCode }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setReservationCode(input);
    }
  };

  const performAction = async () => {
    try {
      let url;
      if (action === 'delete') {
        url = `/delete-reservation/${reservationCode}`;
      } else if (action === 'update') {
        // Perform update action
        // Example: url = `/update-reservation/${reservationCode}`;
      }

      const response = await fetch(url, { method: 'DELETE' }); // Change method according to the action
      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        setIsDeleted(true);
        setMessage(data.message);
      } else {
        setMessage(data.message);
        setIsDeleted(true);
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
      setIsDeleted(false);
      setMessage('Network error, please try again later.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{action === 'update' ? 'Please enter your reservation code:' : 'Please enter your reservation code:'}</h2>
        <input
          type="text"
          placeholder="Reservation Code"
          value={reservationCode}
          onChange={handleInputChange}
          className="reservation-input"
        />
        {!isDeleted && (
          <>
            <button onClick={performAction}>{action === 'update' ? 'Update' : 'Confirm Deletion'}</button>
          </>
        )}
        {isDeleted && (
          <>
            <h2>{message}</h2>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}

export default UpdatePage;
