import React from 'react';
import NavBar from '../../../shared/NavBar';
import SideBar from '../../../shared/SideBar';
import { useNavigate } from 'react-router-dom';

function ClubDashboard({admin}) {
  const navigate=useNavigate();
  if(!admin){
    navigate('/club');
  }
  return (
    <div>
        <NavBar />
        <SideBar />

    </div>
  )
}

export default ClubDashboard

