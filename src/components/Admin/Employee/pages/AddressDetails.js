import React from 'react';
import { TextField, Box } from '@mui/material';

export function AddressDetails({ register, errors }) {
  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{  borderColor: 'white', borderRadius:"5px"  }} >
        <legend style={{ textAlign: 'center' }}>Address</legend>
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
            <TextField
              margin="normal"
              fullWidth
              label="Street"
              {...register('address.street')}
            />
            <TextField
              margin="normal"
              fullWidth
              label="City"
              {...register('address.city')}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              margin="normal"
              fullWidth
              label="State"
              {...register('address.state')}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Zip Code"
              {...register('address.zipCode')}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              margin="normal"
              fullWidth
              label="Country"
              {...register('address.country')}
            />
          </Box>
        </Box>
      </fieldset>
    </Box>
  );
}
