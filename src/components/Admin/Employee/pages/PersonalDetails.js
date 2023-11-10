import React from 'react';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
export function PersonalDetails({ register, errors,watch, setValue }) {
  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{  borderColor: 'white', borderRadius:"5px"  }}>
        <legend style={{ textAlign: 'center' }}>Personal Details</legend>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          noValidate
          autoComplete="off"
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField required id="firstName" label="First Name"  {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message} />
            <TextField required id="lastName" label="Last Name"  {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField required id="fatherName" label="Father Name"  {...register('fatherName', { required: 'Father name is required' })}
              error={!!errors.fatherName}
              helperText={errors.fatherName?.message} />
            <TextField required id="email" label="Email"  {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Phone Number"
              {...register('phoneNumber', { required: 'Phone number is required' })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={watch('dateOfBirth')}
                format="dd/MM/yyyy"
                onChange={(date) => setValue('dateOfBirth', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    fullWidth
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </fieldset>
    </Box>
  );
}
