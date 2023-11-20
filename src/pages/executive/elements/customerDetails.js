import React from 'react';
import { Typography, Container, Box, Card, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {useNavigate} from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CustomerDetails = () => {
  let navigate = useNavigate()
  const customerDetailsData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    address: " 1234 Main St, Anytown, USA"
  };

  const handleBackClick =()=>{
    navigate('/')
  }
  const handleStart =()=>{
    navigate('/executive/customerform')
  }
  return (
    <Container sx={{
      width: '100%',
      height: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection:"column",
      p: 3,
      backgroundColor: "#f7f7f8",
    }}>
      
      <Card sx={{
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}>
        <Box>
          <Box sx={{display:"flex"}}>
            <ArrowBackIcon onClick={handleBackClick} sx={{ fontSize:30}} /> 
          <Typography variant="h5" sx={{ mb: 3, fontFamily: "Poppins, sans-serif"}}>
             Customer Details
          </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Name:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2 , fontFamily: "Poppins, sans-serif"}}>
              {customerDetailsData.name}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Email:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2 , fontFamily: "Poppins, sans-serif"}}>
              {customerDetailsData.email}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Phone:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2, fontFamily: "Poppins, sans-serif" }}>
              {customerDetailsData.phone}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1 , fontFamily: "Poppins, sans-serif"}}>
              Address:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', fontFamily: "Poppins, sans-serif" }}>
              {customerDetailsData.address}
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" endIcon={<SendIcon />} sx={{
          mt: 3,
          alignSelf: 'center',
        }} onClick={handleStart} >
        Start
      </Button>
      </Card>
    </Container>
  );
};

export default CustomerDetails;
