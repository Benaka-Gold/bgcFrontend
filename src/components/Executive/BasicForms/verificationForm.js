import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select, FormHelperText, styled, Grid
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
      <Box sx={{ p: 2, maxWidth: 800, margin: 'auto' }}>
      <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <StyledTextareaAutosize
          minRows={3}
          placeholder="Current Residential Address"
          name="currentAddress"
          style={{ width: '100%', margin: '8px 0' }}
          {...register('currentAddress', { required: 'Current Residential Address  is required' })}
          error={!!errors.currentAddress}
          helperText={errors.currentAddress?.message}
        />
        </Grid>

        <Grid item xs={12} md={6}>
        <StyledTextareaAutosize
          minRows={3}
          placeholder="Office/Business Address"
          name="officeBusinessAddress"
          {...register('officeBusinessAddress', { required: 'officeBusinessAddress  is required' })}
          error={!!errors.officeBusinessAddress}
          helperText={errors.officeBusinessAddress?.message}
          style={{ width: '100%', margin: '8px 0' }}
        />
        </Grid>


        {/* Residential Status */}
        <Grid item xs={12} md={6}>
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
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="NRI">NRI</MenuItem>
                <MenuItem value="PIO">PIO</MenuItem>
                <MenuItem value="Foreign Resident">Foreign Resident</MenuItem>
                <MenuItem value="Dual Citizen">Dual Citizen</MenuItem>
              </Select>
            )}
          />
          {errors.residentialStatus && <FormHelperText>{errors.residentialStatus.message}</FormHelperText>}
        </StyledFormControl>
        </Grid>
        
       </Grid>
      </Box>
    </LocalizationProvider>
  )
}

export default VerificationalForm
