// import * as React from 'react';
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { login } from "../../apis/login/login.js";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { Fade } from '@mui/material'
import Loader from "../Loader";


import Otp from "../otp/otp";
export default function Login({ loginData, setLoginData }) {
  const [error, setError] = useState({});
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = React.useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const auth = useSelector((state) => state.AuthReducer);
  const benakaLogo = '/logo/benakaLogo.png'

  const regexExp = /^[6-9]\d{9}$/;

  if (auth.isAuthenticated === true) {
    if (auth?.user?.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    if (auth?.user?.role === 'Telecaller') {
      return <Navigate to="/telecaller" />;
    }
    if (auth?.user?.role === 'Executive') {
      return <Navigate to="/executive" />;
    }
    if (auth?.user?.role === 'accounts') {
      return <Navigate to="/accounts/dashboard" />;
    }
    if (auth?.user?.role === 'branch') {
      return <Navigate to="/branch/dashboard" />;
    }
    return <Navigate to="/404" />;
  }


  const onchangehandler = (e) => {
    let { name, value } = e.target;
    if (isNaN(value)) {
      console.log(value);
      setError({ [name]: "Only Numberical Values" })
    } else if (value.length > 10) {
      setError({ [name]: "Enter Only 10 Digit Number" })
    } else if (value === " ") {
      setError({ [name]: "Empty Space Not allowed" })
    }
    else {
      setLoginData({ ...loginData, [name]: value });
    }
  };


 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(validate(loginData));
    setButtonDisabled(true); 
    if (regexExp.test(loginData?.phoneNumber)) {
      setLoading(true);
      const loginRes = await login(loginData);
      if (loginRes.status === 200) {
        setVisible(!visible);
        setLoginData({ ...loginData, otpSent: true });
      } else {
        alert("Number was not registered");
      }
      setLoading(false);
    }
  };

  const validate = (values) => {
    let errors = {};
    if (!regexExp.test(values?.phoneNumber)) {
      errors.phoneNumber = "Enter Valid Number";
    }
    return errors;
  };

  const typographyStyles = {
    fontFamily: 'Poppins, sans-serif', 
  };
  const formStyles = {
    width: { md: '35%', sm: '50%', xs: '85%', lg: '30%' },
    height: { md: '60vh', sm: '60vh', xs: '60vh', lg: '70vh' },
    background: "white",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.5s",
    p:3
  };

  const containerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(45deg, #e66465, #9198e5, #a1c4fd, #fbc2eb, #ff9a9e)",
  }
  const copyrightStyles = {
    fontSize: "12px",
    fontFamily: 'Poppins, sans-serif',
  };

  return (
      <Box sx={{...containerStyles}}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ ...formStyles, boxShadow : 3 }}
      >
        <img src={benakaLogo} style={{ width: "120px", p: 2 }} alt="Benaka logo" />

        <Typography variant="h5" component="h2" sx={{ p: 1, ...typographyStyles }}>
          Benaka Gold Company
        </Typography>
        <Typography variant="h5" component="h2" sx={{ p: 1, ...typographyStyles, fontSize:"14px" }}>
          Welcome Back
        </Typography>

        <Fade in={visible} timeout={500} style={{position : 'inherit'}} unmountOnExit >
          <Box sx={{ p: 2 }}>
            <TextField
              margin="normal"
              required
              style={{ marginTop: "16px", width: "90%", margin: "10px", height: "50px", fontFamily: 'Poppins, sans-serif' }}
              id="email"
              label="Enter Your Phone Number"
              name="phoneNumber"
              autoComplete="phone"
              autoFocus
              error={error.phoneNumber ? true : false}
              helperText={error.phoneNumber}
              value={loginData?.phoneNumber}
              onChange={onchangehandler}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "16px", width: "90%", margin: "20px", height: "50px", fontFamily: 'Poppins, sans-serif' }}
              onClick={handleSubmit}
              disabled={buttonDisabled}
            >
              Get OTP
            </Button>
          </Box>
        </Fade>

        <Fade in={!visible} timeout={500} unmountOnExit style={{position : 'inherit'}}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Otp loginData={loginData} setLoginData={setLoginData} />
          </Box>
        </Fade>

        <div style={copyrightStyles}>
          &copy; {new Date().getFullYear()} Benaka Gold Company. All rights reserved.
        </div>
      </Box>
      {/* </Card> */}
      <Loader loading={loading} />
    </Box>
  );
}
