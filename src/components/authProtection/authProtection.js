import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {getUserData} from '../../apis/login/login'
import { SnackbarProvider, enqueueSnackbar } from "notistack";


function Protected() {
  const location = useLocation();
  const authState = useSelector((state) => state.AuthReducer);
  const isAuthenticated = authState.isAuthenticated || localStorage.getItem('auth');
  const userRole = (authState.user && authState.user.role) || localStorage.getItem('role');

  const validateToken = async()=>{
      try {
        const response = await getUserData()
      } catch (error) {
        enqueueSnackbar({message: 'Login Expired. Please re-login.', variant:"error"})
        localStorage.clear()
        return <Navigate to="/" state={{ from: location }} />;
      }
  }
  useEffect(()=>{
    validateToken()
  },[])

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  const rolePath = `/${userRole.toLowerCase()}`;
  if (!location.pathname.startsWith(rolePath)) {
    return <Navigate to={rolePath} />;
  }
  return <Outlet />
}

export default Protected;
