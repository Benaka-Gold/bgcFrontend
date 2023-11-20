import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField, Box } from '@mui/material';

export function AddressDetails() {
  const { register, formState: { errors } } = useFormContext();
  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'white', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Address</legend>
        <Box
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
            <TextField
              margin="normal"
              fullWidth
              label="Street"
              {...register('address.street', { required: 'Street is required' })}
              error={!!errors.address?.street}
              helperText={errors.address?.street?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="City"
              {...register('address.city', { required: 'City is required' })}
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              margin="normal"
              fullWidth
              label="State"
              {...register('address.state', { required: 'State is required' })}
              error={!!errors.address?.state}
              helperText={errors.address?.state?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Zip Code"
              {...register('address.zipCode', { required: 'Zip Code is required' })}
              error={!!errors.address?.zipCode}
              helperText={errors.address?.zipCode?.message}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Country"
              {...register('address.country', { required: 'Country is required' })}
              error={!!errors.address?.country}
              helperText={errors.address?.country?.message}
            />
          </Box>
        </Box>
      </fieldset>
    </Box>
  );
}
