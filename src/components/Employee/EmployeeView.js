import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

const ViewEmployeeDialog = ({ open, onClose, employeeData }) => {
  if (!employeeData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Employee Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Employee Code:</Typography>
            <Typography variant="body2">{employeeData?.empCode}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">First Name:</Typography>
            <Typography variant="body2">{employeeData?.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Last Name:</Typography>
            <Typography variant="body2">{employeeData?.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography variant="body2">{employeeData?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Phone Number:</Typography>
            <Typography variant="body2">{employeeData?.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Father's Name:</Typography>
            <Typography variant="body2">{employeeData?.fatherName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Date of Birth:</Typography>
            <Typography variant="body2">{employeeData?.dateOfBirth}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Street:</Typography>
            <Typography variant="body2">{employeeData?.address?.street}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">City:</Typography>
            <Typography variant="body2">{employeeData?.address?.city}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">State:</Typography>
            <Typography variant="body2">{employeeData?.address?.state}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Zip Code:</Typography>
            <Typography variant="body2">{employeeData?.address?.zipCode}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Country:</Typography>
            <Typography variant="body2">{employeeData?.address?.country}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Position:</Typography>
            <Typography variant="body2">{employeeData?.position}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Department:</Typography>
            <Typography variant="body2">{employeeData?.department}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Team ID:</Typography>
            <Typography variant="body2">{employeeData?.teamId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Date Hired:</Typography>
            <Typography variant="body2">{employeeData?.dateHired}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
