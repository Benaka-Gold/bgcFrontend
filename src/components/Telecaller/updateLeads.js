import React from 'react'
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import { Box } from "@mui/material";
import Loader from '../Loader';


function UpdateLeads({ selectedLead, feedbackFunc, handleChange, updateFunc, loading, sourceFunc }) {
  return (
    <Box sx={{ width: "40%" }}>
      <FormControl sx={{ p: 5, borderRadius: "10px", width: "70%", backgroundColor: "white" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="phone"
          autoFocus
          disabled
          value={selectedLead?.name}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="phoneNumber"
          label="Phone Number"
          name="phoneNumber"
          autoComplete="phone"
          autoFocus
          disabled
          value={selectedLead?.phoneNumber}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          disabled
          value={selectedLead?.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="purity"
          label="Purity"
          name="purity"
          autoComplete="purity"
          autoFocus
          value={selectedLead?.purity}
          onChange={feedbackFunc}
        /><TextField
          margin="normal"
          required
          fullWidth
          id="weight"
          label=" Weight"
          name="weight"
          autoComplete="weight"
          autoFocus
          value={selectedLead?.weight}
          onChange={feedbackFunc}
        />
        <FormControl fullWidth>

          <InputLabel id="demo-simple-select-label" sx={{mt:1}}>Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedLead?.status || " "}
            label="Age"
            onChange={handleChange}
            style={{ marginTop: "10px" }}
          >
            <MenuItem value="Follow up">Follow up</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Invalid">Invalid</MenuItem>
            <MenuItem value="TCL">TCL</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{mt:1}}>
          <InputLabel id="demo-simple-select-label" sx={{mt:1.2}}>Source</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Source"
            value={selectedLead?.source || " "}
            onChange={sourceFunc}
            style={{ marginTop: "10px"}}
          >
            <MenuItem value="Banner">Banner</MenuItem>
            <MenuItem value="Bus Brand">Bus Brand</MenuItem>
            <MenuItem value="Existing customer">Existing customer</MenuItem>
            <MenuItem value="Friend Referal">Friend Referal</MenuItem>
            <MenuItem value="TV">TV</MenuItem>
            <MenuItem value="Wallpaint">Wallpaint</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
          </Select>
        </FormControl>

        <Textarea rows={3} placeholder="Feedback" name="feedback" value={selectedLead.feedback} onChange={feedbackFunc} style={{ marginTop: "18px" }} />
        <Button variant="contained" style={{ marginTop: "25px" }} onClick={updateFunc}>Update Leads</Button>
      </FormControl>
      <Loader loading={loading} />
    </Box>
  )
}

export default UpdateLeads
