import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "../components/Login/login";
import { SnackbarProvider } from "notistack";

export default function Auth() {
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    otp: "",
    otpSent: false
  })
  
  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <SnackbarProvider>
      <Login setLoginData={setLoginData} loginData={loginData} />
      </SnackbarProvider>
    </ThemeProvider>
  )
}


