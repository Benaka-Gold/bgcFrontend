import React, { useEffect, useState } from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { useNavigate } from 'react-router-dom'
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux"
import { verifyLogin } from '../../apis/login/login';
import { Box } from '@mui/material';
import Loader from "../Loader";


const Otp = ({ loginData, setLoginData }) => {
  const [error, setError] = useState()
  const [otpRes, setOtpRes] = useState({})
  const [loading, setLoading] = React.useState(false)

  let navigate = useNavigate()
  const dispatch = useDispatch();



  const handleChange = (newValue) => {

    if (isNaN(newValue)) {
      setError("Enter Only Numbers")
    }
    else if (newValue.length > 6) {
      setError("Enter 6 Digit OTP")
    } else if (newValue === " ") {
      setError("Empty Space not allowed")
    }
    else {
      setLoginData({ ...loginData, otp: newValue })
    }
  }
  useEffect(() => {
    if (otpRes?.user?.role === "admin") {
      return navigate('/admin')
    }
    else if (otpRes?.user?.role === "Telecaller") {
      return navigate('/telecaller')
    }
    else {
      // console.log(false);
    }
  }, [otpRes])

  const loginFunc = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload = {
      phoneNumber: loginData.phoneNumber,
      otp: loginData.otp
    };
  
    if (loginData.otp !== " " && loginData.otp.length >= 6 && !isNaN(loginData.otp)) {
      const response = await verifyLogin(payload);
      if (response.status === 200) {
        dispatch({ type: "LOGGEDIN", payload: response.data, isteamLead:  response.data.teamMembers});
        setOtpRes(response.data);
      } else {
        alert("Invalid OTP");
      }
      setTimeout(()=>{
        setLoading(false)
      },250)
    } 
    setTimeout(()=>{
      setLoading(false)
    },250)
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", m: 1 }}>
      <MuiOtpInput length={6} name="otp" value={loginData.otp} onChange={handleChange} sx={{ minWidth: "330px", margin: "auto", gap:"10px", marginLeft:"45px", marginRight:"45px", m:3 }} autoFocus />
      <span>{error}</span>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        style={{ marginTop: "16px", width: "80%", margin: "20px", height: "50px" }}
        onClick={loginFunc}
        disabled={loginData.otp.length !== 6}
      >
        Login
      </Button>
      <Loader loading={loading} />
    </Box>
  )
}

export default Otp;