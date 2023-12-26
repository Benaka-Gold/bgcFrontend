import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { deleteFile } from '../../../../../apis/fileUpload';
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const ReleaseCopyDialog = ({ open, setOpen, handleFileChange, handleSubmit, imagePreview, selectedFile, setSelectedFile, setImagePreview }) => {
    const handleDeleteImage =async()=>{
       try{ if (selectedFile) {
          const isSuccess = await deleteFile(selectedFile);
          if (isSuccess.status === 200) {
              setImagePreview('');
              setSelectedFile('')
              enqueueSnackbar({message : 'Image Deleted' ,variant : 'success'})
          } }
      }catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
      }
      }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Dialog open={open} onClose={!open}>
        <DialogTitle>Upload Release Copy</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            {imagePreview ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                <IconButton onClick={ handleDeleteImage}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
                Upload File
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedFile}>Submit</Button>
        </DialogActions>
      </Dialog>
      </SnackbarProvider>
  );
};

export default ReleaseCopyDialog;