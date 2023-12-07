import  React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import BasicDetailsForm from '../../../components/Executive/BasicForms/basicDetailsForm';
import dayjs from 'dayjs';
// import VerificationForm from './verificationForm'
import OfficeDetails from './officeDetails';
import VerificationalForm from './verificationForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateCustomer } from '../../../apis/customer';
import { getCustomerById } from '../../../apis/customer';
import Loader from '../../../components/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function HorizontalLinearStepper() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [customerData, setCustomerData] = useState([])
  const steps = ['Basic Details','Office Details' ,'Verification Details'];
  let navigate = useNavigate()
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');
  
 

  const methods = useForm({
    defaultValues: customerData ||  {
      name: '',
      phoneNumber: '',
      altPhone: '',
      landline: '',
      email: '',
      officePhone: '',
      sourceOfOrnaments: '',
      employmentStatus: '',
      organizationStatus: '',
      annualIncome: '',
      detailsOfJewellery: '',
      natureOfOrnaments: '',
      totalNumberOfOrnaments:'',
      jewelleryBoughtFrom: '',
      dateOfPurchaseOrPledge: null,
      gender: '',
      maritalStatus: '',
      currentAddress: '',
      residentialStatus: '',
      officeBusinessAddress: '',
      dateOfBirth: null,
      addressProof: '',
      addressProofNumber: '',
    }
  });



  const getAssignedLeads = async ()=>{
    let res = await getCustomerById(customerId)
    if (res.data) {
      // Convert date strings to Dayjs objects (or JavaScript Date objects)
      res.data.dateOfPurchaseOrPledge = res.data.dateOfPurchaseOrPledge ? dayjs(res.data.dateOfPurchaseOrPledge) : null;
      res.data.dateOfBirth = res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null;
      // Handle other date fields similarly
      setCustomerData(res.data);
    }
    const updatedFormValues = { ...methods, ...res.data };
      methods.reset(updatedFormValues);
  }
  useEffect(()=>{
    getAssignedLeads()
  },[])

  const handleNext = async (event) => {
    // Prevent the default form action if called from a form event
    if (event) {
      event.preventDefault();
    }
    const isValid = await methods.trigger();
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    methods.reset();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicDetailsForm />;
      case 1:
        return <OfficeDetails />;
        case 2:
        return <VerificationalForm />;
    }
  };


  const onSubmit = async (data) => {
    setLoading(true);  // Move setLoading(true) outside of setTimeout
  
    try {
      let res = await updateCustomer(customerId, data);
      if (res.status === 200) {
        // No need for setTimeout here unless there's a specific reason for a delay
        alert('Form Submitted Successfully');
        // Update local storage status
        const status = JSON.parse(localStorage.getItem('status')) || {};
        status.isBasicDetails = true;
        localStorage.setItem('status', JSON.stringify(status));
        navigate(`/executive/customerdetails?filter=${customerId}`);
      } else {
        console.log('Form submission failed with status:', res.status);
        alert('Something went wrong');
      }
    } catch (error) {
      console.error('Form submission error', error);
      alert('An error occurred while submitting the form');
    } finally {
      setLoading(false);  // Ensure loading is set to false regardless of the outcome
    }
  };

  return (
    <FormProvider {...methods}>
     <Box sx={{ width: {xs :'100%', lg:"calc(100% - 240px)", sm:"calc(100% - 240px)", md:"calc(100% - 240px)"}, p: 2, ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" } ,mt:{lg:5, sm:5, xs:0, md:5}}}>
      <Box sx={{ width: { xs: '100%', md: '60%' }, margin: 'auto' }}>
      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center", mb:3 }}>
          <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
          <Typography variant="h5" sx={{ p: 2 }}>
            Basic Details Form
          </Typography>
        </Box>
        <Stepper activeStep={activeStep} sx={{ width: '100%' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      </Box>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate >
        {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 ,  width: '60%', margin: 'auto'}}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button type="submit">Finish</Button>
            ) : (
              <Button type="button" onClick={(event) => handleNext(event)}>Next</Button> // Set the type to "button"
            )}
          </Box>
      </form>
      <Loader loading={loading} />
    </Box>
  </FormProvider>
  );
}
