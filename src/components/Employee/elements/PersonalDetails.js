import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export function PersonalDetails() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'white', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Personal Details</legend>
        <Box
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', width:"100%" }}>
            <TextField
              required
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              required
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              required
              label="Father Name"
              {...register('fatherName', { required: 'Father name is required' })}
              error={!!errors.fatherName}
              helperText={errors.fatherName?.message}
            />
            <TextField
              required
              label="Email"
              {...register('email', { required: 'Email is required', pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: 'Email is not valid',
              }})}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              required
              label="Phone Number"
              {...register('phoneNumber', { required: 'Phone number is required', minLength: {
                value: 10,
                message: 'Phone number must be at least 10 digits long',
              }})}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={value}
                    onChange={onChange}
                    format='dd/MM/yyyy'
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!error}
                        helperText={error ? error.message : null}
                        margin="normal"
                        fullWidth
                      />
                    )}
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
