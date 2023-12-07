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

const CustomTextField = ({ name, label, required, startAdornment,isRequired }) => {
  const { register,control, formState: { errors } } = useFormContext();
  
    return (
      <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        required={required}
        label={label}
        name={name}
        {...register(name, { required: isRequired ?? `${name} is required.` })}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        InputProps={startAdornment}
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
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    rules={{ required: `${label} is required` }}
                    render={({ field }) => (
                        <Select
                            labelId={`${name}-label`}
                            id={name}
                            label={label}
                            {...field}
                        >
                            {items.map(item => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledFormBox
        noValidate
      >
        <Box sx={{
          p: 2,
          maxWidth: 800,
          margin: 'auto',
        }}>

          <Grid container spacing={2}>
            <CustomTextField name={'name'} label={'Customer Name'} isRequired={true}/>
            <CustomTextField label={'Mobile Number'} name={'phoneNumber'} isRequired={true} 
            startAdornment={{ startAdornment: <InputAdornment position="start">Mob-</InputAdornment> }}
            />
            <CustomTextField name={'altPhone'} label={'Alternate Mobile'} isRequired={true}/>   
            <CustomTextField name={'landline'} label={'Landline Number'} isRequired={false}/>
            <CustomTextField name={'email'} label={'E-mail'} isRequired={true}/>
            <CustomTextField name={'totalNumberOfOrnaments'} label={'Total Number Of Ornaments'} isRequired={true}/>

            <CustomSelect
               name={"sourceOfOrnaments"}
               label={'Source of Ornaments'}
               items={[
                {value : "Purchased",label : 'Purchased'},
                {value : "Got as Gift",label : 'Got as Gift'},
                {value : "Acquired from Parents",label : 'Acquired from Parents'},
              ]} />

            {/* Nature of Ornament */}
              <CustomSelect
               name={"natureOfOrnaments"}
               label={'Nature of Ornament'}
               items={[
                {value : "Used Gold Ornament",label : 'Used Gold Ornament'},
                {value : "Bullion",label : 'Bullion'},
                {value : "Gold Coin",label : 'Gold Coin'},
                {value : "Others",label : 'Others'},
              ]} />

            <CustomSelect
              name={"detailsOfJewellery"}
              label={'Details of Jewellery'}
              items={[
                { value: "Pledged", label: 'Pledged' },
                { value: "Physical Gold", label: 'Physical Gold' },
              ]} />

            {/* Gender */}
            <CustomSelect name={"gender"}  label={'Gender'}
               items={[
                {value : "Male",label : 'Male'},
                {value : "Female",label : 'Female'},
                {value : "Others",label : 'Others'},
              ]} />

            
            <Grid item xs={12} md={6}>
              <StyledTextareaAutosize
                minRows={3}
                fullWidth
                required
                placeholder="Jewellery Bought / Pledged Name and Address"
                name="jewelleryDetails"
                variant="outlined"
                style={{ width: '100%', margin: '8px 0' }}
                {...register('jewelleryDetails', { required: 'jewellary PledgeAddress  is required' })}
                error={!!errors.jewelleryDetails}
                helpertext={errors.jewelleryDetails?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dateOfPurchaseOrPledge"
                  control={control}
                  rules={{ required: 'Date of purchase is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Date of Purchase / Pledge"
                      {...field}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={!!error}
                          helpertext={error ? error.message : null}
                          
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            
          </Grid>
        </Box>
      </StyledFormBox>
    </LocalizationProvider>
  );
}

export default ApplicationForm;