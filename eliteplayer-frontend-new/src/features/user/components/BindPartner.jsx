import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../../shared/NavBar';
import SideBar from '../../../shared/SideBar';

function BindPartner({ user }) {
  const [partnerIds, setPartnerIds] = useState([]);
  const [inputId, setInputId] = useState('');
  const [status, setStatus] = useState('');

  const handleAddId = () => {
    if (inputId && !partnerIds.includes(inputId) && inputId !== user._id) {
      setPartnerIds([...partnerIds, inputId]);
      setInputId('');
    }
  };

  const handleSubmit = async () => {
    if (partnerIds.length < 1) {
      setStatus('At least one partner is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/partners', {
        initiatedBy: user._id,
        joinedBy: partnerIds,
        createdBy: user._id,
      });

      if (response.status === 201 || response.status === 200) {
        setStatus('Partner added successfully!');
        setPartnerIds([]);
      }
    } catch (error) {
      console.error('API error:', error.response || error);
      setStatus('Failed to bind partner: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <NavBar />
      <SideBar />
      
      <div style={{ marginLeft: '100px', padding: '1rem' }}>
        <h2>Bind Partner</h2>
        <p>Your ID: <strong>{user?._id}</strong></p>

        <input
          type="text"
          placeholder="Enter Partner User ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <button onClick={handleAddId}>Add</button>

        <div>
          <p>Selected Partner IDs:</p>
          <ul>
            {partnerIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>

        <button onClick={handleSubmit}>Submit Partnership</button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}

export default BindPartner;
