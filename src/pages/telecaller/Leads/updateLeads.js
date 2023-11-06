import React from 'react'
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { TextField  } from '@mui/material';
import Textarea from '@mui/joy/Textarea';
import Loader from '../../../components/Loader';


function UpdateLeads({selectedLead, feedbackFunc, handleChange, updateFunc, loading}) {
  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", width: "90%", alignItems: "center" }}>
    <form style={{ padding: "20px", boxShadow: "33px 10px 79px 61px rgba(0,0,0,0.1),0px 10px 15px -3px rgba(0,0,0,0.1)", borderRadius: "10px", width: "90%", marginLeft: "60px" }}>
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

        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedLead?.status || " "}
          label="Age"
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        >
          <MenuItem value="Follow up">Follow up</MenuItem>
          <MenuItem value="Confirmed Lead">Confirmed</MenuItem>
          <MenuItem value="Invalid">Invalid</MenuItem>
          <MenuItem value="TCL">TCL</MenuItem>
        </Select>
      </FormControl>
      <Textarea rows={3} placeholder="Feedback" name="feedback" value={selectedLead.feedback} onChange={feedbackFunc} style={{ marginTop: "18px" }} />
      <Button variant="contained" style={{ marginTop: "25px" }} onClick={updateFunc}>Update Leads</Button>
    </form>
    <Loader loading={loading} />
  </div>
  )
}

export default UpdateLeads
