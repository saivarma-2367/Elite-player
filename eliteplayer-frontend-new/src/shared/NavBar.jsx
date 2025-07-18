import React from 'react';
import './NavBar.css';
import img1 from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';


function NavBar() {
  const navigate=useNavigate();
  const handleLogout=()=>{
    navigate("/");
  }
  return (
    <div className='Main-div'>
      <div className='left-div'>
        <img className='logo-img' src={img1} alt='logo' />
      <h1 className='Main-Title'>Elite Player</h1>
      </div>
      <button onClick={handleLogout}>LogOut</button>
    </div>
  )
}

export default NavBar