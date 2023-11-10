import React, { useCallback, useEffect, useState } from 'react';

import { Paper, TextField, Button, Box, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getDepartment, getTeamByType } from '../../../apis/team';

export function CompanyDetails({ register, errors, watch, setValue }) {
  const [selectDepartment, setSelectDepartment] = useState([])
  const [teams, setTeams] = useState([])
  const handleDeptChange = async (e) => {
    setValue("department", e.target.value)
    fetchTeams(e.target.value)
  }
  const handleTeams = (e) => {
    setValue("teamId", e.target.value)
  }
  const Deparments = async () => {
    let response = await getDepartment()
    if (response.status === 200) {
      setSelectDepartment(response.data)
    }
  }
  const fetchTeams = async (department) => {
    const res = await getTeamByType(department)
    setTeams(res.data.data)
  }
  useEffect(() => {
    Deparments()
  }, [])

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{  borderColor: 'white', borderRadius:"5px"  }} >
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
          <Box sx={{display : 'flex',flexDirection : 'row',width : '100%'}}>
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
          <Box sx={{display : 'flex',flexDirection : 'row',width : '98%'}} gap={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{  backgroundColor: "white" }}>Department</InputLabel  >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="user"
                sx={{ backgroundColor: "white" }}
                name="department"
                onChange={handleDeptChange}
              >
                {selectDepartment && selectDepartment.map((item) => (
                  <MenuItem value={item.name} key={item._id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>


            <FormControl fullWidth>
              <InputLabel
                id="teams"
              >
                Teams
              </InputLabel>
              <Select
                labelId="teams"
                disabled={teams.length < 1}
                id="teams-select"
                label="user"
                style={{ backgroundColor: 'white', width: '100%' }}
                name="teamId"
                onChange={handleTeams}
              >
                {teams.length > 0 && teams.map((team) => <MenuItem value={team._id}>{team.name}</MenuItem>)}
              </Select>
            </FormControl>

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date Hired"
                value={watch('dateHired')}
                onChange={(date) => setValue('dateHired', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    fullWidth
                    error={!!errors.dateHired}
                    helperText={errors.dateHired?.message}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </fieldset>
    </Box>
  );
}
