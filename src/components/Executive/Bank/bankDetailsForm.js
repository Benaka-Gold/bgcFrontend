import React, { useState, useEffect } from 'react';
import { Box,  TextField, FormControl, InputLabel,  MenuItem, Select,  FormHelperText, Typography, Button} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../Loader'; 
import { getCustomerById, updateCustomer } from '../../../apis/customer'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function BankDetails() {
  const [loading, setLoading] = useState(false);
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
      if (response.data) {
        const details = response.data.bankDetails;
        Object.keys(details).forEach(key => {
          setValue(`bankDetails.${key}`, details[key]);
        });
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await updateCustomer(customerId, data);
      if (response.status === 200) {
        alert('Form Uploaded Successfully');
        const status = JSON.parse(localStorage.getItem('status')) || {};
        status.isBankDetails = true;
        localStorage.setItem('status', JSON.stringify(status));
        navigate(`/executive/customerdetails?filter=${customerId}`);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error updating customer data:', error);
      alert('Failed to upload form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height:"90vh", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },}}>
      <Loader loading={loading} />
      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
          <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
          <Typography variant="h5" sx={{ p: 2 }}>
            Bank Details
          </Typography>
        </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate  sx={{ width: '80%', maxWidth: '500px',height:"80%", margin:"auto" }}  >
        <TextField  fullWidth   required label="Bank Name"
          {...register('bankDetails.bankName', { required: 'Bank Name is required' })}
          error={!!errors.bankDetails?.bankName}
          helperText={errors.bankDetails?.bankName?.message}
          sx={{ mb: 2 }} />

        <FormControl fullWidth error={!!errors.bankDetails?.accountType} sx={{ mb: 2 }}>
          <InputLabel id="account-type-label">Account Type</InputLabel>
          <Controller
            name="bankDetails.accountType"
            control={control}
            rules={{ required: 'Account Type is required' }}
            render={({ field }) => (
              <Select
                labelId="account-type-label"
                id="account-type"
                label="Account Type"
                {...field} >
                <MenuItem value="Savings Account">Savings Account</MenuItem>
                <MenuItem value="Current Account">Current Account</MenuItem>
              </Select>)} />
          <FormHelperText>{errors.bankDetails?.accountType?.message}</FormHelperText>
        </FormControl>
        <TextField  fullWidth  required label="Account Number"
          {...register('bankDetails.accountNumber', { required: 'Account Number is required' })}
          error={!!errors.bankDetails?.accountNumber}
          helperText={errors.bankDetails?.accountNumber?.message}
          sx={{ mb: 2 }} />

        <TextField fullWidth  required
          label="Account Holder Name"
          {...register('bankDetails.accountHolderName', { required: 'Account Holder Name is required' })}
          error={!!errors.bankDetails?.accountHolderName}
          helperText={errors.bankDetails?.accountHolderName?.message}
          sx={{ mb: 2 }} />

        <TextField fullWidth  required label="IFSC / MICR"
          {...register('bankDetails.ifscMicr', { required: 'IFSC/MICR is required' })}
          error={!!errors.bankDetails?.ifscMicr}
          helperText={errors.bankDetails?.ifscMicr?.message}
          sx={{ mb: 2 }}   />

        <TextField  fullWidth required label="Branch"
          {...register('bankDetails.branch', { required: 'Branch is required' })}
          error={!!errors.bankDetails?.branch}
          helperText={errors.bankDetails?.branch?.message}
          sx={{ mb: 2 }} />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
export default BankDetails;
