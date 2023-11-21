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

function ApplicationForm() {
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
      <TextField
        fullWidth
        required
        label="Customer Name"
        name="name"
        {...register('name', { required: 'Customer name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        required
        label="Mobile Number"
        name="phoneNumber"
        {...register('phoneNumber', { required: 'Mobile Number  is required' })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">Mob-</InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        required
        label="Alter Mobile Number"
        name="altPhone"
        {...register('altPhone', { required: ' Alter Mobile Number  is required' })}
              error={!!errors.altPhone}
              helperText={errors.altPhone?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">Mob-</InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="Land Line Number(s)"
        name="landline"
        {...register('landline', { required: ' Landline Number  is required' })}
        error={!!errors.landline}
        helperText={errors.landline?.message}
      />
    
      <TextField
        fullWidth
        required
        label="E-Mail ID"
        name="email"
        {...register('email', { required: 'email  is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* <form autoComplete="off"> */}
      <FormControl fullWidth margin="normal" error={!!errors.sourceOfOrnaments}>
      <InputLabel id="employment-status-label">Source of Ornament</InputLabel>
      <Controller
        name="sourceOfOrnaments"
        control={control}
        rules={{ required: 'Source of ornament is required' }}
        render={({ field }) => (
          <Select
            labelId="employment-status-label"
            id="source-of-ornament"
            label="Source of Ornament"
            {...field}
          >
            <MenuItem value="Purchased">Purchased</MenuItem>
            <MenuItem value="Got as Gift">Got as Gift</MenuItem>
            <MenuItem value="Acquired from Parents">Acquired from Parents</MenuItem>
          </Select>
        )}
      />
      {errors.sourceOfOrnaments && <FormHelperText>{errors.sourceOfOrnaments.message}</FormHelperText>}
    </FormControl>

        {/* Employment Status */}
       

        {/* Details of Jewellery */}
        <FormControl fullWidth margin="normal" error={!!errors.detailsOfJewellery}>
      <InputLabel id="details-of-jewellery-label">Details of Jewellery</InputLabel>
      <Controller
        name="detailsOfJewellery"
        control={control}
        rules={{ required: 'This field is required' }}
        render={({ field }) => (
          <Select
            labelId="details-of-jewellery-label"
            id="details-of-jewellery"
            label="Details of Jewellery"
            {...field}
          >
            <MenuItem value="pledged">Pledged</MenuItem>
            <MenuItem value="physicalGold">Physical Gold</MenuItem>
          </Select>
        )}
      />
      {errors.detailsOfJewellery && <FormHelperText>{errors.detailsOfJewellery.message}</FormHelperText>}
    </FormControl>

        {/* Add other select dropdowns following the same pattern... */}

        {/* Nature of Ornament */}
        <FormControl fullWidth margin="normal" error={!!errors.natureOfOrnament}>
      <InputLabel id="nature-of-ornament-label">Nature of Ornament</InputLabel>
      <Controller
        name="natureOfOrnament"
        control={control}
        rules={{ required: 'Nature of ornament is required' }}
        render={({ field }) => (
          <Select
            labelId="nature-of-ornament-label"
            id="nature-of-ornament"
            label="Nature of Ornament"
            {...field}
          >
            <MenuItem value="usedGoldOrnament">Used Gold Ornament</MenuItem>
            <MenuItem value="bullion">Bullion</MenuItem>
            <MenuItem value="goldCoin">Gold Coin</MenuItem>
            <MenuItem value="others">Others</MenuItem>
          </Select>
        )}
      />
      {errors.natureOfOrnament && <FormHelperText>{errors.natureOfOrnament.message}</FormHelperText>}
    </FormControl>


    <TextField
        fullWidth
        required
        label="Total Number Of Ornaments"
        name="totalNumberOfOrnaments"
        {...register('totalNumberOfOrnaments', { required: 'Total Number Of Ornaments  is required' })}
        error={!!errors.totalNumberOfOrnaments}
        helperText={errors.totalNumberOfOrnaments?.message}
      />
        
       <TextareaAutosize
          minRows={3}
          placeholder="Jewellery Bought / Pledged Name and Address"
          name="jewelleryBoughtFrom"
          style={{ width: '100%', margin: '8px 0' }} // Make sure the width matches that of the other fields
          {...register('jewelleryBoughtFrom', { required: 'jewellary PledgeAddress  is required' })}
        error={!!errors.jewelleryBoughtFrom}
        helperText={errors.jewelleryBoughtFrom?.message}
        />
       
       <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name="dateOfPurchaseOrPledge"
        control={control}
        rules={{ required: 'Date of purchase is required' }}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Date of Purchase / Pledge"
            {...field}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error ? error.message : null}
                fullWidth
              />
            )}
          />
        )}
      />
    </LocalizationProvider>
        
        
    
      
      {/* Gender */}
      <FormControl fullWidth margin="normal" error={!!errors.gender}>
      <InputLabel id="gender-label">Gender</InputLabel>
      <Controller
        name="gender"
        control={control} // control object from useFormContext
        rules={{ required: 'Gender is required' }} // validation rules
        render={({ field }) => ( 
          <Select
            labelId="gender-label"
            id="gender"
            label="Gender"
            {...field} // spread the field object onto Select
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        )}
      />
      {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>} 
    </FormControl>
      </StyledFormBox>
    </LocalizationProvider>
  );
}

export default ApplicationForm;
