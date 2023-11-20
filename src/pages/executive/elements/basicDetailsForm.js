import React from "react";
import {
  Box,
  TextField,
  FormControl,
  Button,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,FormHelperText
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ "& .MuiTextField-root": { m: 1 }, width: "90%" }}
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
        name="altphoneNumber"
        {...register('altphoneNumber', { required: ' Alter Mobile Number  is required' })}
              error={!!errors.altphoneNumber}
              helperText={errors.altphoneNumber?.message}
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
        label="Office Land Line Number(s)"
        name="officePhone"
        {...register('officePhone', { required: 'Office Landline   is required' })}
        error={!!errors.officePhone}
        helperText={errors.officePhone?.message}
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

      <form autoComplete="off">
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
        name="dateOfPurchase"
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
        render={({ field }) => ( // destructuring field object from the Controller
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

        <TextareaAutosize
          minRows={3}
          placeholder="Current Residential Address"
          name="currentAddress"
         
          style={{ width: '100%', margin: '8px 0' }}
          {...register('currentAddress', { required: 'Current Residential Address  is required' })}
          error={!!errors.currentAddress}
          helperText={errors.currentAddress?.message}
        />
         

<TextareaAutosize
          minRows={3}
          placeholder="Office/Business Address"
          name="officeBusinessAddress"
          {...register('officeBusinessAddress', { required: 'officeBusinessAddress  is required' })}
          error={!!errors.officeBusinessAddress}
          helperText={errors.officeBusinessAddress?.message}
          style={{ width: '100%', margin: '8px 0' }}
        />
       

        {/* Residential Status */}
        <FormControl fullWidth margin="normal" error={!!errors.residentialStatus}>
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
    </FormControl>

        <TextField label="Pan Details"fullWidth  name="panDetails" 
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
        <TextField label="ID Proof Number"  name="idProofNumber" fullWidth 
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
        <TextField label="Address Proof Number" fullWidth name="addressProofNumber" 
         {...register('addressProofNumber', { required: 'addressProofNumber  is required' })}
          error={!!errors.addressProofNumber}
          helperText={errors.addressProofNumber?.message}/>
      </form>
    </Box>
    </LocalizationProvider>
  );
}

export default ApplicationForm;
