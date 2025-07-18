import React from 'react';
import './SideBar.css';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const navigate = useNavigate();

  const handleBindPartnerClick = () => {
    navigate('/bindPartner');
  };

  const handleSlotBooking = ()=>{
    navigate('/slotBooking');
  }

  return (
    <div className='Side-Main-div'>
      <button className="sidebar-btn" onClick={handleSlotBooking}>Slot Booking</button>
      <button className="sidebar-btn">MemberShip Info</button>
      <button className="sidebar-btn" onClick={handleBindPartnerClick}>Bind Partner</button>
      <button className="sidebar-btn">Event Registrations</button>
      <button className="sidebar-btn">Bring Guest</button>
      <button className="sidebar-btn">Refer Friends</button>
      <button className="sidebar-btn">Rate My Gameplay</button>
      <button className="sidebar-btn">Rate My Club</button>
      <button className="sidebar-btn">Buy Sports Essentials</button>
    </div>
  );
}

export default SideBar;
