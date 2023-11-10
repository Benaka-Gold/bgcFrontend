import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getDepartment, getTeamByType } from '../../../apis/team';

export function CompanyDetails() {
  const { register, setValue, getValues, formState: { errors } } = useFormContext();
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartment();
      if (response.status === 200) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeams = async (department) => {
    try {
      const res = await getTeamByType(department);
      setTeams(res.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Load departments when component mounts
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle change in department
  const handleDeptChange = (event) => {
    const selectedDepartment = event.target.value;
    console.log(event.target.value);
    setValue('department', selectedDepartment);
    fetchTeams(selectedDepartment);
    setValue('teamId', ''); // Reset teamId when department changes
  };

  const handleTeamChange = (event) => {
    const selectedTeam = event.target.value;
    setValue('teamId', selectedTeam, { shouldValidate: true });
  };
  
  // Register dateHired field for form validation
  useEffect(() => {
    register('dateHired', { required: 'Hire date is required' });
  }, [register]);

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'white', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Company Details</legend>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
          noValidate
          autoComplete="off"
        >
           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            margin="normal"
            label="Employee Code"
            {...register('empCode', { required: 'Employee code is required' })}
            error={!!errors.empCode}
            helperText={errors.empCode?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Position"
            {...register('position')}
          />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width:"60%"  , gap:2} }>

          <FormControl fullWidth margin="normal">
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department-select"
              label="Department"
              {...register('department')}
              value={getValues('department') || ''}
              onChange={handleDeptChange}
            >
              {departments.map((item) => (
                <MenuItem value={item.name} key={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="team-label">Teams</InputLabel>
            <Select
              labelId="team-label"
              id="team-select"
              label="Teams"
              {...register('teamId')}
              value={getValues('teamId') || ''}
              onChange={handleTeamChange}
              disabled={teams.length < 1}
            >
              {teams.map((team,key) => 
                {
                  return <MenuItem value={team._id} key={key}>{team.name}</MenuItem>})}
            </Select>
          </FormControl>
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date Hired"
              value={getValues('dateHired') || null}
              onChange={(date) => setValue('dateHired', date, { shouldValidate: true })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateHired}
                  helperText={errors.dateHired?.message}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
      </fieldset>
    </Box>
  );
}
