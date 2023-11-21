import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

function BankDetailsForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bankDetails: {
        accountHolderName: '',
        bankName: '',
        accountType: '',
        ifscMicr: '',
        branch: '',
        accountNumber:''
      }
    }
  });

  const onSubmit = data => {
    // Handle form submission
    console.log(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6">Bank Details</Typography>
      <TextField
        fullWidth
        required
        label="Bank Name"
        {...register("bankDetails.bankName", { required: "Bank Name is required" })}
        error={!!errors.bankDetails?.bankName}
        helperText={errors.bankDetails?.bankName?.message}
      />
       <FormControl fullWidth margin="normal" error={!!errors.bankDetails?.accountType}>
        <InputLabel id="account-type-label">Account Type</InputLabel>
        <Controller
          name="bankDetails.accountType"
          control={control}
          rules={{ required: "Account Type is required" }}
          render={({ field }) => (
            <Select
              labelId="account-type-label"
              id="account-type"
              label="Account Type"
              {...field}
            >
              <MenuItem value="Savings Account">Savings Account</MenuItem>
              <MenuItem value="Current Account">Current Account</MenuItem>
            </Select>
          )}
        />
        {errors.bankDetails?.accountType && (
          <FormHelperText>{errors.bankDetails?.accountType.message}</FormHelperText>
        )}
      </FormControl>
      <TextField
        fullWidth
        required
        label="Account Number"
        {...register("bankDetails.accountNumber", { required: "Account Number is required" })}
        error={!!errors.bankDetails?.accountNumber}
        helperText={errors.bankDetails?.accountNumber?.message}
      />
      <TextField
        fullWidth
        required
        label="Account Holder Name"
        {...register("bankDetails.accountHolderName", { required: "Account Holder name is required" })}
        error={!!errors.bankDetails?.accountHolderName}
        helperText={errors.bankDetails?.accountHolderName?.message}
      />

      <TextField
        fullWidth
        required
        label="ifsc / Micr"
        {...register("bankDetails.ifscMicr", { required: "ifscMicr is required" })}
        error={!!errors.bankDetails?.ifscMicr}
        helperText={errors.bankDetails?.ifscMicr?.message}
      />
      <TextField
        fullWidth
        required
        label="branch"
        {...register("bankDetails.branch", { required: "branch is required" })}
        error={!!errors.bankDetails?.branch}
        helperText={errors.bankDetails?.branch?.message}
      />


      {/* Account Type */}
     

      {/* ... other fields remain the same ... */}

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}

export default BankDetailsForm;
