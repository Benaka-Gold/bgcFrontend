import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Card, Button, Collapse, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { executiveTask } from '../../../apis/task';
import { updateTask } from '../../../apis/task';
import Loader from '../../Loader';

const VerificationButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));


const CustomerDetails = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(false)
  const [display, setDisplay] = useState({
    isBasicDetails: false,
    isOrnamentDetails: false,
    isVerification: false,
    isBankDetails: false,
    isDocumentsUpload: false,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const key = 'status'
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');
  const status = {
    isBasicDetails: false,
    isOrnamentDetails: false,
    isVerification: false,
    isBankDetails: false,
    isDocumentsUpload: false,
  }

  const fetchAssignedLeads = async () => {
    try {
      const res = await executiveTask();
      if (res?.data?.data) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          const filtered = res.data.data.filter(item => item.customerId._id === customerId);
          setAssignedLeads(filtered);
        }, 250)
      } else {
        console.error('No data received from executiveTask');
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, [customerId]);

  const handleBackClick = () => {
    navigate('/');
  };

  function statusVerification() {
    if (localStorage.getItem(key) !== null) {
      const storedObject = JSON.parse(localStorage.getItem(key));
      setDisplay(storedObject)
    } else {
      console.log('Key not found in localStorage');
    }
  }

  useEffect(() => {
    statusVerification()
  }, [])

  
const isApprovalSent = () => {
  return assignedLeads.some(lead => lead.status === 'op_approval');
};
    localStorage.setItem('status', JSON.stringify(status));
    const leadToUpdate = assignedLeads.find(lead => lead.customerId._id === customerId);
  const handleStartClick = async () => {
    console.log(leadToUpdate);
    if (leadToUpdate) {
      const updatedLead = { ...leadToUpdate, status: 'started' };
      console.log(updatedLead);
      setLoading(true)
      setTimeout(async () => {
        setLoading(false)
        let response = await updateTask(updatedLead._id, updatedLead);
        console.log(response);
        fetchAssignedLeads()
      })
    } else {
      console.error('Lead not found');
    }
  };
console.log(assignedLeads);
  const canSendApproval = () => {
    return Object.values(display).every(value => value === true);
  };
  const handleApproval = () => {
     if(leadToUpdate){
    const leadToUpdate = assignedLeads.find(lead => lead.customerId._id === customerId);
    console.log(leadToUpdate);
    if (leadToUpdate) {
      const updatedLead = { ...leadToUpdate, status: 'op_approval' };
      setLoading(true)
      setTimeout(async () => {
        setLoading(false)
        let response = await updateTask(updatedLead._id, updatedLead);
        console.log(response);
        fetchAssignedLeads()
      })
    } else {
      console.error('Lead not found');
    }
  }else{
    alert('Complete All the forms')
  }
  }

  const shouldShowStartButton = () => {
    return assignedLeads.every(lead => lead.status !== 'pending');
  };


  return (
    <Box 
    sx={{width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, 
    height:"auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },mt:{lg:5, sm:5, xs:0, md:5}
    }}>
      <Box sx={{width:"100%", height:"100%", margin:'auto'}}>
      <Card sx={{ p: 3, width: { md: "70%", sm: "70%", xs: "100%", lg: "30%" },margin:"auto", boxShadow: '1px 1px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        {assignedLeads.map((item, index) => (
          <Box key={index} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex' }}>
              <ArrowBackIcon onClick={handleBackClick} sx={{ fontSize: 30 }} />
              <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif' }}>
                Customer Details
              </Typography>
            </Box>
            <CustomerDetailItem title="Name" detail={item.customerId.name} />
            <CustomerDetailItem title="Email" detail={item.customerId.email} />
            <CustomerDetailItem title="Phone" detail={item.customerId.phoneNumber} />
            <CustomerDetailItem title="Address" detail={item.customerId.currentAddress} />
          </Box>
        ))}

        {shouldShowStartButton() ? (
          <Box>
          <VerificationOptions customerId={customerId} display={display} />
          {canSendApproval() && (
            <Box>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{ mt: 3, alignSelf: 'center', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                onClick={handleApproval}
                disabled={isApprovalSent()}
              >
                   {isApprovalSent() ? "Waiting for Approval" : "Send Approval"}
              </Button>
            </Box>
          )}
        </Box>
        ) :
          (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 3, alignSelf: 'center', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
              onClick={handleStartClick}
            >
              Start
            </Button>
          )}
      </Card>
      <Loader loading={loading} />
      </Box>
    </Box>
  );
};

const CustomerDetailItem = ({ title, detail }) => (
  <Box>
    <Typography variant="subtitle1" component="div" sx={{ fontSize: '11px', float: 'left', clear: 'left', mt: 1, fontFamily: 'Poppins, sans-serif' }}>
      {title}:
    </Typography>
    <Typography variant="body2" component="div" sx={{ fontSize: '16px', float: 'left', clear: 'left', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
      {detail}
    </Typography>
  </Box>
);

const VerificationOptions = ({ customerId, display }) => (
  <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', mb: 2 }}>
    <VerificationOptionButton label="Basic Details" path={`/executive/customerform?filter=${customerId}`} isCompleted={display?.isBasicDetails} />
    <VerificationOptionButton label="Ornaments Details" path={`/executive/ornamentlist?filter=${customerId}`} isCompleted={display?.isOrnamentDetails} />
    <VerificationOptionButton label="Verification Details" path={`/executive/houseverification?filter=${customerId}`} isCompleted={display?.isVerification} />
    <VerificationOptionButton label="Bank Details" path={`/executive/bankdetailsform?filter=${customerId}`} isCompleted={display?.isBankDetails} />
    <VerificationOptionButton label="Upload Documents" path={`/executive/uploaddocuments?filter=${customerId}`} isCompleted={display?.isDocumentsUpload} />
  </Box>
);
const VerificationOptionButton = ({ customerId, label, path, isCompleted, display }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#EFEFEF', height: '50px', borderRadius: '10px', alignItems: 'center', p: 2, mb: 1 }}>
      <VerificationButton variant="text" onClick={() => navigate(path)} sx={{ textTransform: 'none', color: 'black', mb: 1, fontFamily: 'Poppins, sans-serif' }}>
        {label}
      </VerificationButton>
      <CheckCircleIcon sx={{ color: isCompleted ? 'green' : 'white' }} />
    </Box>
  );
};

export default CustomerDetails;
