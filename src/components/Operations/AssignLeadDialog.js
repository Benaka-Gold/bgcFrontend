import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  MenuItem,
  FormLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  colors,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LoadingButton from "@mui/lab/LoadingButton";

const AssignLeadDialog = ({
  assignDialogOpen,
  setAssignDialogOpen,
  executives,
  confirmLeadFunc,
  assignConfirm,
  setAssignConfirm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      appointmentTime: null,
    },
  });

  return (
    <Dialog
      maxWidth="lg"
      open={assignDialogOpen}
      onClose={() => {
        setAssignDialogOpen(!assignDialogOpen);
        setAssignConfirm(false);
      }}
    >
      <DialogTitle sx={{ fontFamily: "Poppins" }} variant="h6">
        Assign Lead to Executive
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(confirmLeadFunc)}>
          <Box>
            <Box m={1}>
              <FormLabel error={!!errors.goldType}>Gold Type</FormLabel>
              <Select
                fullWidth
                defaultValue=""
                {...register("goldType", { required: true })}
                error={!!errors.goldType}
              >
                <MenuItem value="Physical Gold">Physical Gold</MenuItem>
                <MenuItem value="Releasing Pledged Gold">
                  Releasing Pledged Gold
                </MenuItem>
              </Select>
              {errors.goldType && (
                <p style={{ color: "red" }}>Gold Type is required.</p>
              )}
            </Box>
            <Box m={1}>
              <FormLabel error={!!errors.executive}>Executive</FormLabel>
              <Select
                fullWidth
                defaultValue=""
                {...register("executive", { required: true })}
                error={!!errors.executive}
              >
                {executives.map((exec, index) => (
                  <MenuItem value={exec._id} key={index}>
                    {exec.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.executive && (
                <p style={{ color: "red" }}>Executive selection is required.</p>
              )}
            </Box>
            <Box m={1}>
              <FormLabel>Appointment Time</FormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Controller
                    name="appointmentTime"
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) => {
                        // Assuming the value is a Date object
                        const hours = value ? value.getHours() : 0;
                        return hours >= 9 && hours <= 20; // 20 means 8 PM
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TimePicker
                        label="Appointment Time"
                        value={value}
                        onChange={(newValue) => {
                          onChange(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  />
                </div>
                {errors.appointmentTime && (
                  <p style={{ color: "red" }}>
                    Appointment Time is required and should be between 9 AM and
                    8 PM.
                  </p>
                )}
              </LocalizationProvider>
            </Box>
          </Box>
          <DialogActions>
            <LoadingButton
              type="submit"
              loading={assignConfirm}
              variant="contained"
            >
              Confirm
            </LoadingButton>
            <Button
              onClick={() => {
                setAssignDialogOpen(!assignDialogOpen);
                setAssignConfirm(false);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignLeadDialog;
