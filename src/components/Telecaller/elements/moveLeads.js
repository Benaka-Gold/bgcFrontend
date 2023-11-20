import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Modal } from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from "@mui/material/Typography";


function MoveLeads({moveLeadModel, handleClose, style, handleTeams, teams, handleMoveLead}) {
  return (
    <Modal
        open={moveLeadModel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
            MoveLeads
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Teams</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ marginTop: "10px" }}
              onChange={handleTeams}
            >
              {teams && teams.map((item) => (
                <MenuItem value={item._id} key={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" style={{ marginTop: "25px" }} onClick={handleMoveLead} >Update</Button>
          </FormControl>
        </Box>
      </Modal>
  )
}

export default MoveLeads
