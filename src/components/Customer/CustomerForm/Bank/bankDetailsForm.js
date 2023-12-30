import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, InputLabel, MenuItem, Select, FormHelperText, Typography, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../../Loader';
import { getCustomerById, updateCustomer } from '../../../../apis/customer';
import { updateTask } from '../../../../apis/task';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import {updateBusiness, getBussiness} from '../../../../apis/business'

function BankDetails() {
  const [loading, setLoading] = useState(false);
  const [assignedTask, setAssignedTask] = useState()
  const [isAccountTransfer, setIsAccountTransfer] = useState(false)
  const [transferType, setTransferType] = React.useState('');
  const [businessId, setBusinessId] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = new URLSearchParams(location.search).get('filter');

  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      bankDetails: {
        bankName: '',
        accountType: '',
        accountNumber: '',
        accountHolderName: '',
        ifscMicr: '',
        branch: '',
      }
    }
  });

  useEffect(() => {
    fetchData();
  }, [customerId, setValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getCustomerById(customerId);
      
      if (response?.data) {
        const details = response?.data?.bankDetails;
        if (details && typeof details === 'object') {
          Object.keys(details).forEach(key => {
              setValue(`bankDetails.${key}`, details[key]);
          });
        }
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
      setTimeout(()=>{
        setLoading(false)
      },250)
    }
  };

  useEffect(()=>{
    let task =async()=>{
     let response =await fetchAssignedTask(customerId)
     console.log(response[0].businessId);
     setAssignedTask(response)
     setBusinessId(response[0].businessId)
     try{
      const businessResponse =await getBussiness(response[0].businessId)
      setTransferType(businessResponse.data.transactionType)
     }catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
     }
    } 
    task()
   },[])

  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const onSubmit = async (data) => {
    setLoading(true);
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isBankDetails = true;
   let  businessUpdated ={transactionType : transferType}
    try {
      const response = await updateCustomer(customerId, data);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      const businessResponse = await updateBusiness(businessId, businessUpdated)
      console.log(businessResponse);
      if (response.status === 200 && taskResponse.status === 200) {
      enqueueSnackbar({message : "Form Submitted" ,variant : 'success'})
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    } finally {
      setLoading(false);
      setTimeout(()=>{
        navigate(`/executive/customerdetails?filter=${customerId}`);
      }, 500)
    }
  };
  const handleChange = (event) => {
    setLoading(true)
    console.log(event.target.value);
    setTransferType(event.target.value);
    if(event.target.value === 'account_transfer'){
      setTimeout(()=>{
        setIsAccountTransfer(true)
        setLoading(false)
      }, 250)
    }else{
      setTimeout(()=>{
        setIsAccountTransfer(false)
        setLoading(false)
      }, 250)
    }
  };

const businessUpdate =async()=>{
  setLoading(true)
  const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isBankDetails = true;
  const businessUpdated = {transactionType : transferType}
  try {
    const response = await updateBusiness(businessId , businessUpdated)
    const taskResponse = await updateTask(updatedTask._id, updatedTask)
    enqueueSnackbar({message:"Form Submitted", variant:'success'})
  } catch (error) {
    enqueueSnackbar({message:error.message, variant:'error'})
  }finally {
      setLoading(false);
      setTimeout(()=>{
        navigate(`/executive/customerdetails?filter=${customerId}`);
      }, 500)
  }
}
  
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height: "90vh", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, }}>
      <Loader loading={loading} />
      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
        <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
        <Typography variant="h5" sx={{ p: 2 }}>
          Bank Details
        </Typography>
      </Box>

      <Box sx={{ width: '80%', maxWidth: '500px', margin: "auto" , mb:2}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={transferType}
          label="Transaction Type"
          onChange={handleChange}
        >
          <MenuItem value='cash'>Cash</MenuItem>
          <MenuItem value='account_transfer'>Account Transfer</MenuItem>
        </Select>
      </FormControl>
      </Box>

      {isAccountTransfer ?
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '80%', maxWidth: '500px', height: "80%", margin: "auto" , mb:2}}  >
        <Box sx={{mt:3}}>
        <TextField fullWidth required label="Bank Name" variant="outlined"
          {...register('bankDetails.bankName', { required: 'Bank Name is required' })}
          error={!!errors.bankDetails?.bankName} helperText={errors.bankDetails?.bankName?.message}
          sx={{ mb: 2 }}  InputLabelProps={{ 
            shrink: true,
          }} />

        <FormControl fullWidth error={!!errors.bankDetails?.accountType} sx={{ mb: 2 }}>
          <InputLabel id="account-type-label">Account Type</InputLabel>
          <Controller
            name="bankDetails.accountType"
            control={control}
            rules={{ required: 'Account Type is required' }}
            render={({ field }) => (
              <Select  labelId="account-type-label"  id="account-type"  label="Account Type"  {...field} >
                <MenuItem value="Savings Account">Savings Account</MenuItem>
                <MenuItem value="Current Account">Current Account</MenuItem>
              </Select>)} />
          <FormHelperText>{errors.bankDetails?.accountType?.message}</FormHelperText>
        </FormControl>

        <TextField fullWidth required label="Account Number" type='number'
          {...register('bankDetails.accountNumber', { required: 'Account Number is required',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Please enter only numbers.',
            }
          })}
          error={!!errors.bankDetails?.accountNumber}
          helperText={errors.bankDetails?.accountNumber?.message}
          
          sx={{ mb: 2 }}InputLabelProps={{ 
            shrink: true,
          }} />

        <TextField fullWidth
          label="Account Holder Name"
          {...register('bankDetails.accountHolderName', { required: 'Account Holder Name is required' })}
          error={!!errors.bankDetails?.accountHolderName}
          helperText={errors.bankDetails?.accountHolderName?.message}
          sx={{ mb: 2 }} InputLabelProps={{ 
            shrink: true,
          }} />

        <TextField fullWidth required label="IFSC / MICR"
          {...register('bankDetails.ifscMicr', { required: 'IFSC/MICR is required' })}
          error={!!errors.bankDetails?.ifscMicr}
          helperText={errors.bankDetails?.ifscMicr?.message}
          sx={{ mb: 2 }} InputLabelProps={{ 
            shrink: true,
          }} />

        <TextField fullWidth required label="Branch"
          {...register('bankDetails.branch', { required: 'Branch is required' })}
          error={!!errors.bankDetails?.branch}  helperText={errors.bankDetails?.branch?.message}
          sx={{ mb: 2 }} InputLabelProps={{  shrink: true, }} />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
          Submit
        </Button>
        </Box>
      </Box>
      :
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width:'80%' }}  disabled={!transferType} onClick={businessUpdate} >Submit</Button>
      }
    </Box>
    </SnackbarProvider>
  );
}
export default BankDetails;
