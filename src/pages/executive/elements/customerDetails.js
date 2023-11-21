import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Card, Button, Collapse, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { executiveTask } from '../../../apis/task';
import VerifiedIcon from '@mui/icons-material/Verified';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Dummy function to mimic fetching tasks


const VerificationButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CustomerDetails = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [display, setDisplay] = useState(false);
  const location = useLocation();
  let navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  let leadId = query.get('filter');
useEffect(() => {
  const fetchAssignedLeads = async () => {
    try {
      const res = await executiveTask();
      if (res?.data?.data) {
        const filtered = res.data.data.filter((item) => {return item.customerId.leadId === leadId});
        setAssignedLeads(filtered);
      } else {
        // Handle the case where there is no data in the response
        console.error('No data received from executiveTask');
      }
    } catch (error) {
      // Handle the case where the API call fails
      console.error('Failed to fetch tasks:', error);
    }
  };

  fetchAssignedLeads();
}, [leadId]);


  const handleBackClick = () => {
    navigate('/');
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: "column",
      p: 3,
      height:"90vh",
      backgroundColor: "#f7f7f8",
      
    }}>
      <Card sx={{
        p: 3,
        width: '100%',
        boxShadow: '1px 1px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        height:"auto",
        overflowY: 'auto',
        
      }}>
        {assignedLeads.map((item) => (
          <Box key={item.customerId.leadId} sx={{ width: '100%' }}>
            <Box sx={{display:"flex", }}>
            <ArrowBackIcon onClick={handleBackClick} sx={{ fontSize:30}} /> 
          <Typography variant="h5" sx={{ mb: 3, fontFamily: "Poppins, sans-serif"}}>
             Customer Details
          </Typography>
          </Box>
          {assignedLeads && assignedLeads.map((item)=>{
            return(
          <Box>
            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Name:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2 , fontFamily: "Poppins, sans-serif"}}>
              {item?.customerId?.name}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Email:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2 , fontFamily: "Poppins, sans-serif"}}>
            {item?.customerId?.email}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1, fontFamily: "Poppins, sans-serif" }}>
              Phone:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', mb: 2, fontFamily: "Poppins, sans-serif" }}>
            {item?.customerId?.phoneNumber}
            </Typography>

            <Typography variant="subtitle1" component="div" sx={{ fontSize: "11px", float: 'left', clear: 'left', mt: 1 , fontFamily: "Poppins, sans-serif"}}>
              Address:
            </Typography>
            <Typography variant="body2" component="div" sx={{ fontSize: "16px", float: 'left', clear: 'left', fontFamily: "Poppins, sans-serif" }}>
            {item?.customerId?.address}
            </Typography>
            
          </Box>
            )
          })}
          </Box>
        ))}

        <Button variant="contained" endIcon={<SendIcon />} sx={{
          mt: 3,
          alignSelf: 'center',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#115293',
          },
        }} onClick={() => setDisplay(!display)} >
          Start
        </Button>
        
        <Collapse in={display} sx={{width:"100%"}}>
          <Box sx={{ width: '100%', mt: 2 , display:"flex", flexDirection:"column", mb:2,}}>
            <Box sx={{display:"flex", justifyContent:"space-between", backgroundColor:"#EFEFEF", height:"50px", borderRadius:"10px", alignItems:"center", p:2, mb:1}}>
            <VerificationButton variant="text" onClick={() => handleButtonClick('/executive/customerform')} sx={{textTransform: 'none',color:"black", mb:1, fontFamily: "Poppins, sans-serif"}} >
              Basic Details
            </VerificationButton>
            <CheckCircleIcon sx={{color:"green"}}  />
            </Box>

            <Box sx={{display:"flex", justifyContent:"space-between", backgroundColor:"#EFEFEF", height:"50px", borderRadius:"10px", alignItems:"center", p:2, mb:1}}>
            <VerificationButton variant="text" onClick={() => handleButtonClick('/executive/ornamentuploads')}  sx={{textTransform: 'none',color:"black", mb:1, fontFamily: "Poppins, sans-serif"}}>
            Verification Details
            </VerificationButton>
            <CheckCircleIcon sx={{color:"white"}}  />
            </Box>

            <Box sx={{display:"flex", justifyContent:"space-between", backgroundColor:"#EFEFEF", height:"50px", borderRadius:"10px", alignItems:"center", p:2, mb:1}}>
            <VerificationButton variant="text" onClick={() => handleButtonClick('/executive/bankdetailsform')} sx={{textTransform: 'none',color:"black", mb:1, fontFamily: "Poppins, sans-serif"}} >
            Ornaments Details
            </VerificationButton>
            <CheckCircleIcon sx={{color:"white"}}  />
            </Box>

            <Box sx={{display:"flex", justifyContent:"space-between", backgroundColor:"#EFEFEF", height:"50px", borderRadius:"10px", alignItems:"center", p:2, mb:1, fontFamily: "Poppins, sans-serif"}}>
            <VerificationButton variant="text" sx={{textTransform: 'none',color:"black", mb:1, fontFamily: "Poppins, sans-serif"}} >
            Bank Details
            </VerificationButton>
            <CheckCircleIcon sx={{color:"white"}}  />
            </Box>
          </Box>
        </Collapse>
      </Card>
    </Container>
  );
}

export default CustomerDetails;
