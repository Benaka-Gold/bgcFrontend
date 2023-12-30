import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function CancelLeadDialog({ cancelDialogOpen, setCancelDialogOpen, onSubmit }) {
    const { control, watch, handleSubmit } = useForm();
    const textAreaValue = watch("textArea"); 
  
    const submitForm = (data) => {
      onSubmit(data.textArea);
    };
  
    return (
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle id="form-dialog-title">Reason For Cancel</DialogTitle>
          <DialogContent>
            <Controller name="textArea"  control={control}
              render={({ field }) => (
                <TextField {...field}  multiline  rows={4}  variant="outlined" fullWidth  label="Reason" />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button   type="submit"   color="primary"   variant="contained"   disabled={!textAreaValue}  >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
