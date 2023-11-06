import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, FormControl, FormHelperText, Button, Select, Menu, MenuItem } from '@mui/material';

const LeadForm = ({ onSubmit,teams }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth margin="normal" error={Boolean(errors.name)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: 'Name is required' }}
          render={({ field }) => <TextField label="Name" variant="outlined" fullWidth {...field} />}
        />
        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.phoneNumber)}>
        <Controller
          name="phoneNumber"
          control={control}
          defaultValue=""
          rules={{ required: 'Phone number is required' }}
          render={({ field }) => <TextField label="Phone" variant="outlined" fullWidth {...field} />}
        />
        {errors.phoneNumber && <FormHelperText>{errors.phoneNumber.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.assignedTeam)}>
        <Controller
          name="assignedTeam"
          control={control}
          defaultValue=""
          rules={{ required: 'Assigned Team is required' }}
          render={({ field }) => {
            return <Select fullWidth {...field}>
              {/* <MenuItem value={'1212'}>ASDASD</MenuItem> */}
              {teams.map((team,key)=> {return <MenuItem key={key} value={team._id}>{team.name}</MenuItem>})}
            </Select>
          }}
        />
        {errors.assignedTeam && <FormHelperText>{errors.assignedTeam.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.weigth)}>
        <Controller
          name="weight"
          control={control}
          defaultValue=""
          rules={{ required: 'Weight is required' }}
          render={({ field }) => <TextField label="Weight" variant="outlined" fullWidth {...field} />}
        />
        {errors.weigth && <FormHelperText>{errors.weigth.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={Boolean(errors.purity)}>
        <Controller
          name="purity"
          control={control}
          defaultValue=""
          rules={{ required: 'Purity is required' }}
          render={({ field }) => <TextField label="Purity" variant="outlined" fullWidth {...field} />}
        />
        {errors.purity && <FormHelperText>{errors.purity.message}</FormHelperText>}
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default LeadForm;