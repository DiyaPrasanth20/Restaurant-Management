import React, { useState } from 'react';
import './UpdatePage.css';
import backgroundImage from './images/findResOne.jpg';

function UpdatePage() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  

  const handleUpdate = () => {
    setShowUpdateModal(true);  
  };

  const handleDelete = () => {
    setShowDeleteModal(true);  
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);  
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);  
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
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState('');
  const [occasion, setOccasion] = useState('');

  const handleInputChange = (event) => {
    const input = event.target.value;
    if (/^\d*$/.test(input)) {
      setReservationCode(input);
    }
  };

  const handleOccasion = (event) => {
    const input = event.target.value;
        setOccasion(input);
  };

  const performAction = async (event) => {
    try {
      let url;
      let actionMethod;
      if (action === 'delete') {
        url = `/delete-reservation/${reservationCode}`;
        actionMethod = 'DELETE'
      } else if (action === 'update') {
            url = `/update-occasion?reservationCode=${reservationCode}&occasion=${occasion}`;
            console.log(url)
            actionMethod = 'PUT'
      } 

      const response = await fetch(url, { method: actionMethod });
      const data = await response.json();
      
      if (data?.reserve === false) {
         setIsUpdated(true);
         console.log(isUpdated)
      }

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
        <h2>{action === 'update' ? 'Update occasion:' : 'Please enter your reservation code:'}</h2>
        <input
          type="text"
          placeholder="Reservation Code"
          value={reservationCode}
          onChange={handleInputChange}
          className="reservation-input"
        />
        {action === 'update' && (
        <input
          type="text"
          placeholder="New Occasion"
          value={occasion}
          onChange={handleOccasion}
          className="reservation-input"
        />
        )}
        {isUpdated && <h2>Invalid Reservation</h2>}
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