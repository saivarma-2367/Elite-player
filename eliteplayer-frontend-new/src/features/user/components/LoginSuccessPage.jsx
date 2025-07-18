import React from 'react';
import NavBar from '../../../shared/NavBar';
import SideBar from '../../../shared/SideBar';

function LoginSuccessPage({ user }) {
  return (
    <div style={{marginTop:0}}>
      <NavBar />
      <SideBar />
      <div style={{ backgroundColor: '#E5E5E5', minHeight: '100vh' , marginTop:'0px',marginLeft:'100px'}} className='Full-div'>
        <h1 style={{marginTop:'0px'}}>Login Successful!</h1>
      {user ? (
        <p>Welcome, <strong>{user.userName}</strong>!</p>
      ) : (
        <p>User information not available.</p>
      )}
      </div>
      
    </div>
  );
}

export default LoginSuccessPage;

