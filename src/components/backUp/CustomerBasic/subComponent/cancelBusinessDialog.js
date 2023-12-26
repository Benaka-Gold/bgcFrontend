import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchAssignedTask } from './CustomerVerification';
import { useLocation } from 'react-router-dom';
// import { updateBusiness, updateTask } from '../../../../apis';
import { updateBusiness } from '../../../../../apis/business';
import { updateTask } from '../../../../../apis/task';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme } from '@mui/material';

const FeedbackDialog = ({ open, handleClose , setLoading, fetchTask}) => {
  const [assignedTask, setAssignedTask] = useState([]);
  const [businessId, setBusinessId] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const [feedbackType, setFeedbackType] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    register('feedbackType', { required: "Feedback type is required" });
  }, [register]);

  useEffect(() => {
    const getTask = async () => {
      const response = await fetchAssignedTask(customerId);
      const businessIds = response.map(item => item?.businessId);
      setBusinessId(businessIds[0]);
      setAssignedTask(response);
    };
    getTask();
  }, [customerId]);
  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const onSubmit = async(data) => {
    setLoading(true)
    const finalFeedback = feedbackType === 'Other' ? data.otherFeedback : feedbackType;
    let updatedbusiness = {...data, status :"cancel_approval", feedback :finalFeedback}
    const updatedTask = { ...Task, status: 'cancel_approval' };
    try {
      const response = await updateBusiness(businessId, updatedbusiness)
      let taskResponse = await updateTask(updatedTask._id, updatedTask);
      console.log(response, taskResponse);
      handleClose(); 
      fetchTask()
    reset(); 
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
      setTimeout(()=>{
        setLoading(false)
      }, 250)
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setFeedbackType(value);
    setValue('feedbackType', value);
  };

  const otherFeedbackValue = watch("otherFeedback");
  const isSubmitDisabled = feedbackType === 'Other' ? !otherFeedbackValue : !feedbackType;

  return (
    <Dialog   open={open}   onClose={handleClose} fullWidth sx={{height:'auto'}} >
      <DialogTitle sx={{fontFamily: 'Poppins, sans-serif' }}>Feedback</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent >
          <FormControl fullWidth margin="dense">
            <InputLabel id="feedback-select-label" sx={{fontFamily: 'Poppins, sans-serif' }}>Feedback Type</InputLabel>
            <Select
              labelId="feedback-select-label"
              value={feedbackType}
              label="Feedback Type"
              onChange={handleSelectChange}
              sx={{fontFamily: 'Poppins, sans-serif' }}
            >
              <MenuItem value="Price issue" sx={{fontFamily: 'Poppins, sans-serif' }}>Price issue</MenuItem>
              <MenuItem value="Non reliant customer" sx={{fontFamily: 'Poppins, sans-serif' }}>Non reliant customer</MenuItem>
              <MenuItem value="Other" sx={{fontFamily: 'Poppins, sans-serif' }}>Other</MenuItem>
            </Select>
          </FormControl>
          {feedbackType === 'Other' && (
            <TextField
              {...register("otherFeedback", { required: "Feedback is required" })}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              margin="dense"
              error={Boolean(errors.otherFeedback)}
              helperText={errors.otherFeedback?.message}
              label="Your Feedback"
              sx={{fontFamily: 'Poppins, sans-serif' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{fontFamily: 'Poppins, sans-serif' }}>Cancel</Button>
          <Button type="submit" disabled={isSubmitDisabled} sx={{fontFamily: 'Poppins, sans-serif' }}>Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FeedbackDialog;
