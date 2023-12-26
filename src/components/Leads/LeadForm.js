import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { getAllDivision } from "../../apis/divisions";
import { getGoldRate } from "../../apis/goldRate";
import { SnackbarProvider, useSnackbar } from "notistack";

const FormSelectControl = ({ name, label, rules, control, options, error  }) => (

  <FormControl fullWidth margin="normal" error={!!error}>
    <InputLabel id={`${name}-label`}>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={''}
      render={({ field }) => (
        <Select labelId={`${name}-label`} id={name} label={label} {...field}>
          {options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {error && <FormHelperText>{error.message}</FormHelperText>}
  </FormControl>
);

const LeadForm = ({ onSubmit, teams, role, open, setOpen,initialState,divisions = [],goldRates = []}) => {
  const { control, handleSubmit, formState: { errors },reset, watch } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [division, setDivision] = React.useState(divisions);
  const [goldRate, setGoldRate] = React.useState(goldRates);
  const goldType = watch("goldType");
  React.useEffect(() => {
     fetchDivision();
     fetchGoldRate();
    if (open) {
      reset(initialState);
    }
  }, [open, reset, initialState]);


  const fetchDivision = async () => {
    try {
      const res = await getAllDivision();
      setDivision(res.data);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const fetchGoldRate = async () => {
    try {
      const response = await getGoldRate();
      setGoldRate(response.data);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };
  


  return (
    <SnackbarProvider>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
      <DialogTitle>
        <Typography>{initialState ? "Update Lead" : "Create a new Lead" }</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField label="Name" variant="outlined" fullWidth {...field} />
                  )}
                />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>

              <FormControl
                fullWidth
                margin="normal"
                error={Boolean(errors.phoneNumber)}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <TextField label="Phone" variant="outlined" fullWidth {...field} type="number" />
                  )}
                />
                {errors.phoneNumber && (
                  <FormHelperText>{errors.phoneNumber.message}</FormHelperText>
                )}
              </FormControl>

              {/* <FormControl fullWidth margin="normal" error={Boolean(errors.weight)}>
                <Controller
                  name="weight"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Weight is required" }}
                  render={({ field }) => (
                    <TextField label="Weight" variant="outlined" fullWidth {...field} />
                  )}
                />
                {errors.weight && <FormHelperText>{errors.weight.message}</FormHelperText>}
              </FormControl> */}

              {/* <FormSelectControl
                name="purity"
                label="Purity"
                rules={{ required: "Purity is required" }}
                control={control}
                options={goldRate.map(gr => ({ value: gr._id, label: gr.purityName }))}
                error={errors.purity}
              /> */}

                <FormSelectControl
                  name="goldType"
                  label="Gold Type"
                  rules={{ required: "Gold Type is required" }}
                  control={control}
                  options={[
                    { value: "physical", label: "Physical" },
                    { value: "release", label: "Release" },
                   ]}
                  error={errors.goldType}
                />

                <FormControl
                fullWidth
                margin="normal"
                error={Boolean(errors.grossWeight)}>
                <Controller
                  name="grossWeight"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Gross Weight is required" }}
                  render={({ field }) => (
                    <TextField label="Gross Weight" variant="outlined" fullWidth {...field} type="number" />
                  )}
                />
                {errors.grossWeight && (
                  <FormHelperText>{errors.grossWeight.message}</FormHelperText>
                )}
              </FormControl>

              {goldType === "release" && (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.netWeight)}
                  >
                    <Controller
                      name="netWeight"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Net Weight is required" }}
                      render={({ field }) => (
                        <TextField label="Net Weight" variant="outlined" fullWidth {...field} type="number" />
                      )}
                    />
                    {errors.netWeight && (
                      <FormHelperText>{errors.netWeight.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
            </Grid>
            <Grid item md={6} xs={12}>
                {role === "Telecaller" ? null :
                  <FormSelectControl
                    name="assignedTeam"
                    label="Assigned Team"
                    rules={{ required: "Assigned Team is required" }}
                    control={control}
                    options={teams.map(team => ({ value: team._id, label: team.name }))}
                    error={errors.assignedTeam}
                  />
                }

              <FormSelectControl
                name="source"
                label="Business Source"
                rules={{ required: "Source is required" }}
                control={control}
                options={[
                  { value: "Banner", label: "Banner" },
                  { value: "Bus Brand", label: "Bus Brand" },
                  { value: "Existing customer", label: "Existing customer" },
                  { value: "Friend Referral", label: "Friend Referral" },
                  { value: "TV", label: "TV" },
                  { value: "Wallpaint", label: "Wallpaint" },
                  { value: "Website", label: "Website" },
                ]}
                error={errors.source}
              />

              <FormSelectControl
                name="status"
                label="Status"
                rules={{ required: "Status is required" }}
                control={control}
                options={[
                  { value: "Follow up", label: "Follow up" },
                  { value: "Confirmed", label: "Confirmed" },
                  { value: "Invalid", label: "Invalid" },
                  { value: "TCL", label: "TCL" },
                ]}
                error={errors.status}
              />
                
              
               
              <FormSelectControl
                name="division"
                label="Division"
                rules={{ required: "Division is required" }}
                control={control}
                options={division.map(d => ({ value: d._id, label: d.divisionName }))}
                error={errors.division}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
               {initialState ? "Update Lead" : "Submit" }
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
    </SnackbarProvider>
  );
};

export default LeadForm;
