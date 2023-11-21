import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,FormHelperText, styled
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useFormContext, Controller } from 'react-hook-form';

function VerificationalForm() {
  const { register, control, formState: { errors } } = useFormContext();
  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: '100%',
  }));
  
  const StyledTextField = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1),
    width: '100%',
  }));
  
  const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    fontSize: '0.875rem',
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.divider,
    '&:focus': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  }));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
       <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          backgroundColor: '#fff', // You can change this color to match your theme
        }}
      >
  <StyledTextareaAutosize
          minRows={3}
          placeholder="Current Residential Address"
          name="currentAddress"
          style={{ width: '100%', margin: '8px 0' }}
          {...register('currentAddress', { required: 'Current Residential Address  is required' })}
          error={!!errors.currentAddress}
          helperText={errors.currentAddress?.message}
        />
         

<StyledTextareaAutosize
          minRows={3}
          placeholder="Office/Business Address"
          name="officeBusinessAddress"
          {...register('officeBusinessAddress', { required: 'officeBusinessAddress  is required' })}
          error={!!errors.officeBusinessAddress}
          helperText={errors.officeBusinessAddress?.message}
          style={{ width: '100%', margin: '8px 0' }}
        />
       

        {/* Residential Status */}
        <StyledFormControl error={!!errors.residentialStatus} fullWidth>
      <InputLabel id="residential-status-label">Residential Status</InputLabel>
      <Controller
        name="residentialStatus"
        control={control}
        rules={{ required: 'Residential status is required' }}
        render={({ field }) => (
          <Select
            labelId="residential-status-label"
            id="residential-status"
            label="Residential Status"
            {...field}
          >
            <MenuItem value="residentIndian">Resident Indian</MenuItem>
            <MenuItem value="nri">NRI</MenuItem>
            <MenuItem value="pio">PIO</MenuItem>
            <MenuItem value="foreignResident">Foreign Resident</MenuItem>
            <MenuItem value="dualCitizen">Dual Citizen</MenuItem>
          </Select>
        )}
      />
      {errors.residentialStatus && <FormHelperText>{errors.residentialStatus.message}</FormHelperText>}
    </StyledFormControl>

       {/* PAN Proof */}
        <StyledTextField label="Pan Details"fullWidth  name="panDetails" 
         {...register('panDetails', { required: 'panDetails  is required' })}
         error={!!errors.panDetails}
         helperText={errors.panDetails?.message}/>

        {/* ID Proof */}
        <FormControl fullWidth margin="normal" error={!!errors.idProof}>
      <InputLabel id="id-proof-label">ID Proof</InputLabel>
      <Controller
        name="idProof"
        control={control}
        rules={{ required: 'ID proof is required' }}
        render={({ field }) => (
          <Select
            labelId="id-proof-label"
            id="id-proof"
            label="ID Proof"
            {...field}
          >
            <MenuItem value="passport">Passport</MenuItem>
            <MenuItem value="drivingLicense">Driving License</MenuItem>
            <MenuItem value="votersId">Voters ID</MenuItem>
            <MenuItem value="rationCard">Ration Card</MenuItem>
            <MenuItem value="pan">PAN</MenuItem>
            <MenuItem value="govtIDCard">Govt ID Card</MenuItem>
            <MenuItem value="aadharCard">Aadhar Card</MenuItem>
            <MenuItem value="latestBankStatement">Latest Bank Statement</MenuItem>
            <MenuItem value="bankPhotoPassBook">Bank Photo Passbook</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        )}
      />
      {errors.idProof && <FormHelperText>{errors.idProof.message}</FormHelperText>}
    </FormControl>
        <StyledTextField label="ID Proof Number"  name="idProofNumber" fullWidth 
        {...register('idProofNumber', { required: 'idProofNumber  is required' })}
        error={!!errors.idProofNumber}
        helperText={errors.idProofNumber?.message}/>



<FormControl fullWidth margin="normal" error={!!errors.addressProof}>
      <InputLabel id="address-proof-label">Address Proof</InputLabel>
      <Controller
        name="addressProof"
        control={control}
        rules={{ required: 'Address proof is required' }}
        render={({ field }) => (
          <Select
            labelId="address-proof-label"
            id="address-proof"
            label="Address Proof"
            {...field}
          >
            <MenuItem value="aadharCard">Aadhar Card</MenuItem>
            <MenuItem value="drivingLicense">Driving License</MenuItem>
            <MenuItem value="votersId">Voters ID</MenuItem>
            <MenuItem value="rationCard">Ration Card</MenuItem>
            <MenuItem value="bsnlBill">BSNL Bill</MenuItem>
            <MenuItem value="latestBankStatement">Latest Bank Statement</MenuItem>
            <MenuItem value="bankPhotoPassBook">Bank Photo Passbook</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        )}
      />
      {errors.addressProof && <FormHelperText>{errors.addressProof.message}</FormHelperText>}
    </FormControl>
        <StyledTextField label="Address Proof Number" fullWidth name="addressProofNumber" 
         {...register('addressProofNumber', { required: 'addressProofNumber  is required' })}
          error={!!errors.addressProofNumber}
          helperText={errors.addressProofNumber?.message}/>
      </Box>
    </LocalizationProvider>
  )
}

export default VerificationalForm
