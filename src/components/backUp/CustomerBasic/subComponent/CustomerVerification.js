import { useNavigate } from "react-router-dom";
import { Box, Button, styled, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { executiveTask } from "../../../../../apis/task";
import { enqueueSnackbar, SnackbarProvider } from "notistack";


export const initialStatus = {
    isBasicDetails: false,
    isOrnamentDetails: false,
    isVerification: false,
    isBankDetails: false,
    isDocumentsUpload: false,
    isPledgedDoc: false,
  };
 export const pledgedInitialStatus = {
    isBasicDetails: false,
    isVerification: false,
    isPledgedDoc: false,
  };
 export const purchaseStartedStatus = {
    isOrnamentDetails: false,
    isBankDetails: false,
    isDocumentsUpload: false,
  };
  
 export const fetchAssignedTask = async (customerId) => {
    try {
      const res = await executiveTask();
      if (res?.data?.data) {
        const filteredTask = res.data.data.filter(item => item.customerId._id === customerId);
        return filteredTask
      } 
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
  };

const VerificationButton = styled(Button)(({ theme }) => ({
    // transition: '0.3s',
    // '&:hover': {
    //   transform: 'scale(1.05)',
    // },
    cursor:"pointer"
  }));

  export const VerificationOptionButton = ({ customerId, label, path, isCompleted, display, disabled }) => {
    const navigate = useNavigate();
    const handleClick = () => {
      if (!disabled) {
        navigate(path);
      }
    };


    return (
      <VerificationButton sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#EFEFEF', height: '50px', cursor:'pointer',borderRadius: '10px', alignItems: 'center', p: 2, mb: 1, cursor: disabled ? 'default' : 'pointer' }}
           onClick={handleClick}>
        <Typography variant="text" sx={{ textTransform: 'none', color: 'black', fontFamily: 'Poppins, sans-serif' }}>
          {label}
        </Typography>
        <CheckCircleIcon sx={{ color: isCompleted ? 'green' : 'white' }} />
      </VerificationButton>
    );
};


 export const CustomerDetailItem = ({ title, detail }) => (
    <Box>
      <Typography variant="subtitle1" component="div" sx={{ fontSize: '11px', float: 'left', clear: 'left', mt: 1, fontFamily: 'Poppins, sans-serif' }}>
        {title}:
      </Typography>
      <Typography variant="body2" component="div" sx={{ fontSize: '16px', float: 'left', clear: 'left', mb: 2, fontFamily: 'Poppins, sans-serif' }}>
        {detail}
      </Typography>
    </Box>
  );

 export const RenderButton = ({ onClick, disabled, buttonText, endIcon }) => (
    <Button
      variant="contained"
      endIcon={endIcon}
      sx={{ mt: 3, alignSelf: 'center', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );

  export const VerificationOptions = ({ customerId, display,disabled }) => (
    <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', mb: 2 , cursor:"pointer"}}>
      <VerificationOptionButton label="Basic Details" path={`/executive/customerform?filter=${customerId}`} isCompleted={display?.isBasicDetails} disabled={disabled}  />
      <VerificationOptionButton label="Ornaments Details" path={`/executive/ornamentlist?filter=${customerId}`} isCompleted={display?.isOrnamentDetails} disabled={disabled} />
      <VerificationOptionButton label="Verification Details" path={`/executive/houseverification?filter=${customerId}`} isCompleted={display?.isVerification} disabled={disabled} />
      <VerificationOptionButton label="Bank Details" path={`/executive/bankdetails?filter=${customerId}`} isCompleted={display?.isBankDetails} disabled={disabled} />
      <VerificationOptionButton label="Upload Documents" path={`/executive/uploaddocuments?filter=${customerId}`} isCompleted={display?.isDocumentsUpload}  disabled={disabled} />
    </Box>
  );
  export const PledgedVerification = ({ customerId, display,disabled }) => (
    <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', mb: 2 , cursor:"pointer"}}>
      <VerificationOptionButton label="Pledged Details" path={`/executive/pledeged?filter=${customerId}`} isCompleted={display?.isPledgedDoc} disabled={disabled}  />
      <VerificationOptionButton label="Basic Details" path={`/executive/customerform?filter=${customerId}`} isCompleted={display?.isBasicDetails} disabled={disabled}  />
      <VerificationOptionButton label="Verification Details" path={`/executive/houseverification?filter=${customerId}`} isCompleted={display?.isVerification}  disabled={disabled} />
    </Box>
  );
  export const StartedPurchase = ({ customerId, display,disabled }) => (
    <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', mb: 2 , cursor:"pointer"}}>
      <VerificationOptionButton label="Ornaments Details" path={`/executive/ornamentlist?filter=${customerId}`} isCompleted={display?.isOrnamentDetails}  disabled={disabled} />
      <VerificationOptionButton label="Bank Details" path={`/executive/bankdetails?filter=${customerId}`} isCompleted={display?.isBankDetails}disabled={disabled}   />
      <VerificationOptionButton label="Upload Documents" path={`/executive/uploaddocuments?filter=${customerId}`} isCompleted={display?.isDocumentsUpload}disabled={disabled}  />
    </Box>
  );

  