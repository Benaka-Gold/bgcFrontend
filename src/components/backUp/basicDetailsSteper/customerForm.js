import  React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import BasicDetailsForm from './basicDetailsForm';
import dayjs from 'dayjs';
// import OfficeDetails from './officeDetails';
import OfficeDetails from './officeDetails'
import VerificationalForm from './verificationForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateCustomer } from '../../../../apis/customer';
import { getCustomerById } from '../../../../apis/customer';
import Loader from '../../../Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { updateTask } from '../../../../apis/task';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';


export default function BasicDetailStepper() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [customerData, setCustomerData] = useState([])
  const [assignedTask, setAssignedTask] = useState()
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
      customerImage:'',
    }
  });



  const getAssignedLeads = async ()=>{
    try{
      let res = await getCustomerById(customerId)
    setLoading(true)
    if (res.data) {
      res.data.dateOfPurchaseOrPledge = res.data.dateOfPurchaseOrPledge ? dayjs(res.data.dateOfPurchaseOrPledge) : null;
      res.data.dateOfBirth = res.data.dateOfBirth ? dayjs(res.data.dateOfBirth) : null;
      setTimeout(()=>{
        setCustomerData(res.data);
        const updatedFormValues = { ...methods, ...res.data };
        methods.reset(updatedFormValues);
        setLoading(false)
      },250)
    }}catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
  }
  useEffect(() => {
    getAssignedLeads()
    let task = async () => {
      let response = await fetchAssignedTask(customerId)
      setAssignedTask(response)
    }
    task()
  }, [])

  
  const handleNext = async (event) => {
    if (event) {
      event.preventDefault();
    }
    const isValid = await methods.trigger();
    if (isValid) {
      setLoading(true)
      setTimeout(()=>{
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setLoading(false)
      }, 250)
    }
  };

  const handleBack = () => {
    setLoading(true)
    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setLoading(false)
    }, 250);
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

  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const onSubmit = async (data) => {
    setLoading(true);  
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isBasicDetails = true;
    try {
      let res = await updateCustomer(customerId, data);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      if (res.status === 200 && taskResponse.status === 200) {
        enqueueSnackbar("Form Submitted", { variant: "success" });
      } 
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setTimeout(()=>{
        navigate(`/executive/customerdetails?filter=${customerId}`);
        setLoading(false); 
      }, 500)
    }
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
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
  </SnackbarProvider>
  );
}
