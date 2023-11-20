import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm, FormProvider } from 'react-hook-form';
import BasicDetailsForm from './basicDetailsForm';
import BankDetailsForm from './bankDetailsForm';
// import VerificationForm from './verificationForm'
import VerificationForm from './verificationForm'
export default function HorizontalLinearStepper() {

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = ['Basic Details', 'Bank Details', 'Create an ad'];



  const methods = useForm({
    defaultValues:  {
      name: '',
      phoneNumber: '',
      altphoneNumber: '',
      landline: '',
      email: '',
      officePhone: '',
      sourceOfOrnaments: '',
      employmentStatus: '',
      organizationStatus: '',
      annualIncome: '',
      detailsOfJewellery: '',
      natureOfOrnament: '',
      totalNumberOfOrnaments:'',
      jewelleryBoughtFrom: '',
      dateOfPurchase: null,
      gender: '',
      maritalStatus: '',
      currentAddress: '',
      residentialStatus: '',
      officeBusinessAddress: '',
      panDetails: '',
      idProof: '',
      idProofNumber: '',
      dateOfBirth: null,
      addressProof: '',
      addressProofNumber: '',
      bankDetails:{
        bankName:"",
        accountType:"",
        accountHolderName	:"",
        ifscCode:	"",
        branch:"",
      },
      source:"",
      verificationRequired:false,
      typesOfVerification:"",
      verificationFeedback:"",
    }
  });

  const { handleSubmit, reset, trigger } = methods;

  

  const handleNext = async () => {
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
        return <BankDetailsForm />;
      case 2:
        return <VerificationForm />;

      default:
        return 'Unknown step';
    }
  };
  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <FormProvider {...methods}>
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
            <Button onClick={handleNext}>Next</Button>
          )}
        </Box>
      </form>
      {activeStep === steps.length && (
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      )}
    </Box>
  </FormProvider>
  );
}
