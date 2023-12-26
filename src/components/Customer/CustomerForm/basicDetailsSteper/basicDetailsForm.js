import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Grid,
  Select, FormHelperText, styled, TextareaAutosize
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormContext, Controller } from 'react-hook-form';

const CustomTextField = ({ name, label, required, startAdornment,isRequired , validation, type}) => {
  const { register,control, formState: { errors } } = useFormContext();
  
    return (
      <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        required={required}
        label={label}
        name={name}
        {...register(name, { required: isRequired ?? `${name} is required.`, validate: validation })}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        InputProps={startAdornment}
        type={type}
      />
      </Grid>
    );
  };
  
  
  const CustomSelect = ({ name, label, items }) => {
    const { control, formState: { errors } } = useFormContext();

    return (
        <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" error={!!errors[name]}>
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <Controller name={name}  control={control} defaultValue="" rules={{ required: `${label} is required` }}
                    render={({ field }) => (
                        <Select labelId={`${name}-label`} id={name} label={label} {...field} >
                            {items.map(item => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select> )}/>
                {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
            </FormControl>
        </Grid>
    );
};

function ApplicationForm() {
  const { register, control, formState: { errors },getValues } = useFormContext();
  const StyledFormBox = styled(Box)(({ theme }) => ({
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
  const validateEmail = (email) => {
    return email.endsWith("@gmail.com") || "Email is not valid";
  };
  
  const validatePhoneNumber = (number) => {
    return /^[6789]\d{9}$/.test(number) || "Enter Valid Phone Number";
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledFormBox noValidate>
        <Box sx={{
          p: 2,
          maxWidth: 800,
          margin: 'auto',
        }}>
          <Grid container spacing={2}>
            <CustomTextField name={'name'} label={'Customer Name'} isRequired={true}/>
            <CustomTextField name={'phoneNumber'} label={'Mobile Number'} isRequired={true} validation={validatePhoneNumber} type={'number'} 
              startAdornment={{ startAdornment: <InputAdornment position="start">Mob-</InputAdornment> }}/>
            <CustomTextField name={'altPhone'} label={'Alternate Mobile'} isRequired={true} validation={validatePhoneNumber} type={'number'}/>   
            <CustomTextField name={'landline'} label={'Landline Number'} isRequired={false}  type={'number'}/>
            <CustomTextField name={'email'} label={'E-mail'} isRequired={false} validation={validateEmail}/>
            <CustomSelect name={"gender"}  label={'Gender'}
               items={[
                {value : "Male",label : 'Male'},
                {value : "Female",label : 'Female'},
                {value : "Others",label : 'Others'},
              ]} />
            
            <CustomSelect name={"employmentStatus"}  label={'Employment Status'}
               items={[
                {value : "Salaried",label : 'Salaried'},
                {value : "Business",label : 'Business'},
                {value : "Self Employed",label : 'Self Employed'},
                {value : "Retired",label : 'Retired'},
                {value : "Others",label : 'Others'},
              ]} />
         
          <CustomTextField name={'annualIncome'} label={'Annual Income'} isRequired={true}  type={'number'}/> 

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" error={!!errors.dateOfBirth}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller  name="dateOfBirth" control={control} rules={{ required: 'Date of birth is required' }}
                  render={({ field }) => (
                    <DatePicker label="Date of Birth" {...field}
                      renderInput={(params) => (
                        <TextField  {...params} fullWidth  error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />  )}  /> )} />
              </LocalizationProvider>
              {errors.dateOfBirth && <FormHelperText error>{errors.dateOfBirth.message}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <CustomSelect name={"maritalStatus"}  label={'Marital Status'}
               items={[
                {value : "Married",label : 'Married'},
                {value : "Single",label : 'Single'},
                {value : "Widow / Widower",label : 'Widow / Widower'},
                {value : "Divorced",label : 'Divorced'},
              ]} />
          </Grid>
        </Box>
      </StyledFormBox>
    </LocalizationProvider>
  );
}

export default ApplicationForm;