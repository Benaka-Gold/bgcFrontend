import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getDepartment, getTeamByType } from '../../../apis/team';
import { getAllDivision } from '../../../apis/divisions';
import dayjs from 'dayjs'; // ensure dayjs is imported
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller } from 'react-hook-form';

export function CompanyDetails() {
  const { register, setValue, getValues, formState: { errors } ,control } = useFormContext();
  const [departments, setDepartments] = useState([]);
  const [division, setDivision] = useState([])
  const [teams, setTeams] = useState([]);
  let dayjsDate = dayjs(getValues('dateHired')); // converting to dayjs object

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
const fetchDivisions = async()=>{
  const response = await getAllDivision()
  setDivision(response.data)
}
  // Load departments when component mounts
  useEffect(() => {
    fetchDepartments();
    fetchDivisions()
  }, []);

  // Handle change in department
  const handleDeptChange = (event) => {
    setValue('department', event.target.value);
    fetchTeams(event.target.value);
    setValue('team', ''); // Reset teamId when department changes
    const role = fetchRole(event.target.value)
    setValue('role',role)
  };

  const fetchRole = (department) =>{
    switch(department){
      case "Telecaller" : return "Telecaller";
      case "Tech" : return "Tech";
      case "Executives" : return "executive";
      case "Accounts" : return "accounts";
      default : return department;
    }
  }

  const handleTeamChange = (event) => {
    const selectedTeam = event.target.value;
    setValue('team', selectedTeam, { shouldValidate: true });
  };

  useEffect(() => {
    register('dateHired', { required: 'Hire date is required' });
  }, [register]);

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'white', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Company Details</legend>
        <Box
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
              defaultValue={''}
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
              {...register('team')}
              value={getValues('team')}
              disabled={teams.length < 1}
              defaultValue={''}
              onChange={handleTeamChange}
            >
              {teams.map((team,key) => 
                {
                  return <MenuItem value={team._id} key={key}>{team.name}</MenuItem>})}
            </Select>
          </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', width:"60%"  , gap:2} }>

          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date Hired"
              value={getValues('dateHired')}
              onChange={(date) => setValue('dateHired', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateHired}
                  helperText={errors.dateHired?.message}
                />
              )}
            />
          </LocalizationProvider> */}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller  name="dateHired" control={control} rules={{ required: 'Date of birth is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Date of Joining"
                      {...field}
                      value={dayjsDate} // ensure this is a dayjs object
                      renderInput={(params) => (
                        <TextField {...params} fullWidth error={!!errors.dateHired} helperText={errors.dateHired?.message} />
                      )}
                    />
                  )}/>
              </LocalizationProvider>
          <FormControl fullWidth margin="normal">
            <InputLabel id="team-label">Division</InputLabel>
            <Select
              labelId="team-label"
              id="team-select"
              label="Division"
              {...register('division')}
              defaultValue={''}
              value={getValues('division') }
            >
              {division.map((team,key) => 
                {
                  return <MenuItem value={team._id} key={key}>{team.divisionName}</MenuItem>})}
            </Select>
          </FormControl>
          </Box>
        </Box>
      </fieldset>
    </Box>
  );
}
