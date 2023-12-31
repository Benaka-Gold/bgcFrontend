import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel } from '@mui/material';
import { PersonalDetails } from './elements/PersonalDetails';
import { AddressDetails } from './elements/AddressDetails';
import { DocumentationDetails } from './elements/DocumentationDetails';
import { CompanyDetails } from './elements/CompanyDetails';
import { enqueueSnackbar } from 'notistack';

const EmployeeForm = ({ open, onClose, employeeData = {}, onSave }) => {

  const initialValue = {
    empCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    fatherName: ' ',
    dateOfBirth: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    position: '',
    department: '',
    teamId: ' ',
    dateHired: new Date(),
    documents: [],
    photo: null,
  }
  const methods = useForm({
    defaultValues: employeeData
  });
  


  const steps = [
    'Personal Details',
    'Address Details',
    'Documentation Details',
    'Company Details'
  ];
  const stepFields = {
    0: ['firstName', 'lastName', 'email', 'phoneNumber','fatherName','dateOfBirth'], // Example fields for PersonalDetails
    1: ['address.street', 'address.city', 'address.state', 'address.zipCode', 'address.country'], // Example fields for AddressDetails
    2: ['documents', 'photo'], // Example fields for DocumentationDetails
    3: ['empCode', 'position', 'department', 'teamId', 'dateHired'], // Example fields for CompanyDetails
  };
  
  const [activeStep, setActiveStep] = React.useState(0)

  // Destructure the needed methods from useForm
  const { handleSubmit, reset, trigger,getValues } = methods;

  const handleNext = async () => {
    // Trigger validation for current step fields
    const result = await trigger(steps[activeStep]);
    if (result) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  // const handleNext = async () => {
  //   const currentFields = stepFields[activeStep];
  //   const result = await trigger(currentFields);
    
  //   if (result) {
  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   }
  // };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission
  const submitForm = async (data) => {
    try {
      if (employeeData) {
        console.log('Updating employee...', data);
      } else {
        console.log('Creating new employee...', data);
      }
      onSave(data); // This should be the logic to save the data to your backend or state management
      setActiveStep(0)
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error'})
    }
  };

  useEffect(() => {
    reset(employeeData);
  }, [employeeData, reset]);

  return (
    <Dialog open={open} onClose={()=>{
      reset(initialValue)
      onClose();
      }} fullWidth={true} maxWidth="md">
      <FormProvider {...methods}> {/* Provide the form context to child components */}
        <DialogTitle>{employeeData ? 'Edit Employee' : 'Create New Employee'}</DialogTitle>
        <DialogContent>
          <form id="employee-form" onSubmit={handleSubmit(submitForm)} noValidate>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && <PersonalDetails />}
            {activeStep === 1 && <AddressDetails />}
            {activeStep === 2 && <DocumentationDetails />}
            {activeStep === 3 && <CompanyDetails />}
          </form>
        </DialogContent>
        <DialogActions>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            // <Button type="submit" form="employee-form">
            //   Save
            // </Button>
            <Button onClick={()=>submitForm(getValues())}>
            Save
          </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default EmployeeForm;
