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
} from "@mui/material";
import { getAllDivision } from "../../apis/divisions";

const LeadForm = ({ onSubmit, teams, role }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [division,setDivision] = React.useState([])

  React.useEffect(()=>{
    fetchDivision()
  },[])

  const fetchDivision = async() => {
    const res = await getAllDivision()
    console.log(res.data)
    setDivision(res.data)

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <TextField label="Phone" variant="outlined" fullWidth {...field} />
          )}
        />
        {errors.phoneNumber && (
          <FormHelperText>{errors.phoneNumber.message}</FormHelperText>
        )}
      </FormControl>
 
     {role === "Telecaller"  ? null :
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(errors.assignedTeam)}
      >
        <Controller
          name="assignedTeam"
          control={control}
          defaultValue=""
          rules={{ required: "Assigned Team is required" }}
          render={({ field }) => {
            return (
              <Select fullWidth {...field} >
                {teams.map((team, key) => {
                  return (
                    <MenuItem key={key} value={team._id}>
                      {team.name}
                    </MenuItem>
                  );
                })}
              </Select>
            );
          }}
        />
        {errors.assignedTeam && (
          <FormHelperText>{errors.assignedTeam.message}</FormHelperText>
        )}
      </FormControl> }

      <FormControl fullWidth margin="normal" error={Boolean(errors.weigth)}>
        <Controller
          name="weight"
          control={control}
          defaultValue=""
          rules={{ required: "Weight is required" }}
          render={({ field }) => (
            <TextField label="Weight" variant="outlined" fullWidth {...field} />
          )}
        />
        {errors.weigth && (
          <FormHelperText>{errors.weigth.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.purity)}>
        <Controller
          name="purity"
          control={control}
          defaultValue=""
          rules={{ required: "Purity is required" }}
          render={({ field }) => (
            <TextField label="Purity" variant="outlined" fullWidth {...field} />
          )}
        />
        {errors.purity && (
          <FormHelperText>{errors.purity.message}</FormHelperText>
        )}
      </FormControl>

      <form>
        <FormControl fullWidth margin="normal" error={!!errors.source}>
          <InputLabel id="employment-status-label">Source </InputLabel>
          <Controller
            name="source"
            control={control}
            rules={{ required: "Source is required" }}
            render={({ field }) => (
              <Select
                labelId="employment-status-label"
                id="source-of-ornament"
                label="Source of Ornament"
                {...field}
              >
                <MenuItem value="Banner">Banner</MenuItem>
                <MenuItem value="Bus Brand">Bus Brand</MenuItem>
                <MenuItem value="Existing customer">Existing customer</MenuItem>
                <MenuItem value="Friend Referal">Friend Referal</MenuItem>
                <MenuItem value="TV">TV</MenuItem>
                <MenuItem value="Wallpaint">Wallpaint</MenuItem>
                <MenuItem value="Website">Website</MenuItem>
              </Select>
            )}
          />
          {errors.source && (
            <FormHelperText>{errors.source.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel id="employment-status-label">Status </InputLabel>
          <Controller
            name="status"
            control={control}
            rules={{ required: "status is required" }}
            render={({ field }) => (
              <Select
                labelId="employment-status-label"
                id="status-of-ornament"
                label="Status"
                {...field}
              >
                <MenuItem value="Follow up">Follow up</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Invalid">Invalid</MenuItem>
                <MenuItem value="TCL">TCL</MenuItem>
              </Select>
            )}
          />
          {errors.status && (
            <FormHelperText>{errors.status.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel id="division-label">Division</InputLabel>
            <Controller
            name="division"
            control={control}
            rules={{ required: "division is required" }}
            render={({ field }) => (
              <Select
                labelId="division-label"
                id="division"
                label="Division"
                {...field}
              >
               {division.map(d => <MenuItem value={d._id} key={d._id}>{d.divisionName}</MenuItem>)}
              </Select>
            )}
          />
          {errors.status && (
            <FormHelperText>{errors.status.message}</FormHelperText>
          )}
        </FormControl>
      </form>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default LeadForm;
