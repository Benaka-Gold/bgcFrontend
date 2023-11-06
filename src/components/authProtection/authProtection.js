import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Protected() {
  const location = useLocation();
  const authState = useSelector((state) => state.AuthReducer);
  const isAuthenticated = authState.isAuthenticated || localStorage.getItem('auth');
  const userRole = (authState.user && authState.user.role) || localStorage.getItem('role');
  const myObjectSerializedRetrieved = localStorage.getItem('user');

  const userData = JSON.parse(myObjectSerializedRetrieved);
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  const rolePath = `/${userRole.toLowerCase()}`;
  // Check if the current path starts with the role path
if (!location.pathname.startsWith(rolePath)) {
  return <Navigate to={rolePath} />;
}


  return <Outlet />
}

export default Protected;
