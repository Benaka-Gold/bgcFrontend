import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,FormHelperText, styled
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useFormContext, Controller } from 'react-hook-form';

function OfficeDetails() {
  const { register, control, formState: { errors } } = useFormContext();
  const StyledFormBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    backgroundColor: 'white', // Change the background color as needed
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: theme.shape.borderRadius,
    margin: 'auto',
    maxWidth: '500px',
    '& .MuiTextField-root': { 
      margin: theme.spacing(1), 
      width: '70%',
    },
    '& .MuiFormControl-root': {
      margin: theme.spacing(1), 
      width: '100%',
    },
  }));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
   <StyledFormBox
        component="form"
        noValidate
      >
       <FormControl fullWidth margin="normal" error={!!errors.employmentStatus}>
      <InputLabel id="employment-status-label">Employment Status</InputLabel>
      <Controller
        name="employmentStatus"
        control={control}
        rules={{ required: 'Employment status is required' }}
        render={({ field }) => (
          <Select
            labelId="employment-status-label"
            id="employment-status"
            label="Employment Status"
            {...field}
          >
            <MenuItem value="salaried">Salaried</MenuItem>
            <MenuItem value="business">Business</MenuItem>
            <MenuItem value="selfEmployed">Self Employed</MenuItem>
            <MenuItem value="retired">Retired</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        )}
      />
      {errors.employmentStatus && <FormHelperText>{errors.employmentStatus.message}</FormHelperText>}
    </FormControl>
        {/* Organization Status */}
        <FormControl fullWidth margin="normal" error={!!errors.organizationStatus}>
      <InputLabel id="organization-status-label">Organisation Status</InputLabel>
      <Controller
        name="organizationStatus"
        control={control}
        rules={{ required: 'Organization status is required' }}
        render={({ field }) => (
          <Select
            labelId="organization-status-label"
            id="organization-status"
            label="Organisation Status"
            {...field}
          >
            <MenuItem value="govt">Govt</MenuItem>
            <MenuItem value="publicSector">Public Sector</MenuItem>
            <MenuItem value="privateSector">Private Sector</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        )}
      />
      {errors.organizationStatus && <FormHelperText>{errors.organizationStatus.message}</FormHelperText>}
    </FormControl>

        {/* Annual Income */}
        <FormControl fullWidth margin="normal" error={!!errors.annualIncome}>
      <InputLabel id="annual-income-label">Your Annual Income</InputLabel>
      <Controller
        name="annualIncome"
        control={control}
        rules={{ required: 'Annual income is required' }}
        render={({ field }) => (
          <Select
            labelId="annual-income-label"
            id="annual-income"
            label="Your Annual Income"
            {...field}
          >
            <MenuItem value="<1l">{"<1L"}</MenuItem>
            <MenuItem value="1L to 2L">1L to 2L</MenuItem>
            <MenuItem value="2L to 5L">2L to 5L</MenuItem>
            <MenuItem value="5L to 8L">5L to 8L</MenuItem>
            <MenuItem value="8L to 10L">8L to 10L</MenuItem>
            <MenuItem value="above 10L">Above 10L</MenuItem>
          </Select>
        )}
      />
      {errors.annualIncome && <FormHelperText>{errors.annualIncome.message}</FormHelperText>}
    </FormControl>
    <TextField
        fullWidth
        label="Office Land Line Number(s)"
        name="officePhone"
        {...register('officePhone', { required: 'Office Landline   is required' })}
        error={!!errors.officePhone}
        helperText={errors.officePhone?.message}
      />
        <FormControl fullWidth margin="normal" error={!!errors.dateOfBirth}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name="dateOfBirth"
          control={control}
          rules={{ required: 'Date of birth is required' }}
          render={({ field }) => (
            <DatePicker
              label="Date of Birth"
              {...field}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfBirth} // Pass the error prop correctly
                  helperText={errors.dateOfBirth?.message}
                />
              )}
            />
          )}
        />
      </LocalizationProvider>
      {errors.dateOfBirth && <FormHelperText error>{errors.dateOfBirth.message}</FormHelperText>}
    </FormControl>

       

        {/* Marital Status */}
        <FormControl fullWidth margin="normal" error={!!errors.maritalStatus}>
      <InputLabel id="marital-status-label">Marital Status</InputLabel>
      <Controller
        name="maritalStatus"
        control={control}
        rules={{ required: 'Marital status is required' }}
        render={({ field }) => (
          <Select
            labelId="marital-status-label"
            id="marital-status"
            label="Marital Status"
            {...field}
          >
            <MenuItem value="married">Married</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="widowWidower">Widow/Widower</MenuItem>
            <MenuItem value="divorced">Divorced</MenuItem>
          </Select>
        )}
      />
      {errors.maritalStatus && <FormHelperText>{errors.maritalStatus.message}</FormHelperText>}
    </FormControl>
      </StyledFormBox>
    </LocalizationProvider>
  );
}

export default OfficeDetails;
