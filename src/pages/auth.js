import React, { useState } from "react";
import Otp from "../components/otp/otp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "../components/Login/login";

export default function Auth() {
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    otp: "",
    otpSent: false
  })
  
  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Login setLoginData={setLoginData} loginData={loginData} />
    </ThemeProvider>
  )
}


