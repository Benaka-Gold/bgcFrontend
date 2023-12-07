import React from "react";
import {  Box, TextField, FormControl,InputLabel, MenuItem, Select, FormHelperText, Grid} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormContext, Controller } from 'react-hook-form';

function OfficeDetails() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 800, margin: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                    <MenuItem value="Salaried">Salaried</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Self Employed">Self Employed</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                )}
              />
              {errors.employmentStatus && <FormHelperText>{errors.employmentStatus.message}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Organization Status */}
          <Grid item xs={12} md={6}>
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
                    <MenuItem value="Govt">Govt</MenuItem>
                    <MenuItem value="Public Sector">Public Sector</MenuItem>
                    <MenuItem value="Private Sector">Private Sector</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                )}
              />
              {errors.organizationStatus && <FormHelperText>{errors.organizationStatus.message}</FormHelperText>}
            </FormControl>
          </Grid>
           {/* Annual Income  */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Annual Income"
              name="annualIncome"
              {...register('annualIncome', { required: 'Annual Income is required' })}
              error={!!errors.annualIncome}
              helperText={errors.annualIncome?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Office Land Line Number(s)"
              name="officePhone"
              {...register('officePhone', { required: 'Office Landline   is required' })}
              error={!!errors.officePhone}
              helperText={errors.officePhone?.message}
            />
          </Grid>
           {/* Date of Birth */}
          <Grid item xs={12} md={6}>
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
          </Grid>
          {/* Marital Status */}
          <Grid item xs={12} md={6}>
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
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Widow / Widower">Widow/Widower</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                  </Select>
                )}
              />
              {errors.maritalStatus && <FormHelperText>{errors.maritalStatus.message}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}

export default OfficeDetails;
