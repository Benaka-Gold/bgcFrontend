import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

function BankDetailsForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Box>
      <Typography>Bank Details</Typography>

      <TextField
        fullWidth
        required
        label="Account Holder Name"
        name="accountHolderName"
        {...register("bankDetails.accountHolderName", { required: "Account Holder name is required" })}
        error={!!errors.bankDetails?.accountHolderName}
        helperText={errors.bankDetails?.accountHolderName?.message}
      />
      <TextField
        fullWidth
        required
        label="Bank Name"
        name="bankName"
        {...register("bankDetails.bankName", { required: "Bank name is required" })}
        error={!!errors.bankDetails?.bankName}
        helperText={errors.bankDetails?.bankName?.message}
      />
      <FormControl fullWidth margin="normal" error={!!errors.bankDetails?.accountType}>
        <InputLabel id="employment-status-label">Account Type</InputLabel>
        <Controller
          name="bankDetails.accountType"
          control={control}
          rules={{ required: "Account Type is required" }}
          render={({ field }) => (
            <Select
              labelId="employment-status-label"
              id="source-of-ornament"
              label="Source of Ornament"
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
        label="IFSC / MICR"
        name="ifscCode"
        {...register("bankDetails.ifscCode", { required: "IFSC / MICR is required" })}
        error={!!errors.bankDetails?.ifscCode}
        helperText={errors.bankDetails?.ifscCode?.message}
      />

      <TextField
        fullWidth
        required
        label="Branch"
        name="branch"
        {...register("bankDetails.branch", { required: "Branch is required" })}
        error={!!errors.bankDetails?.branch}
        helperText={errors.bankDetails?.branch?.message}
      />

     
    </Box>
  );
}

export default BankDetailsForm;
