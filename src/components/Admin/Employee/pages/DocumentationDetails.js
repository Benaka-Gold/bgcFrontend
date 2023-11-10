import React, { useState } from 'react';
import { Box, Typography, Grid, TextField } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import { uploadfiles } from '../../../apis/fileUpload';


export function DocumentationDetails({ register, errors, watch, setValue }) {
  const [aadharDoc, setAadharDoc] = useState({})
  const [addressDoc, setAddressinfo] = useState({})
  const [qualificationDoc, setQualificationDoc] = useState({})
  const [photoDoc, setPhotoDoc] = useState({})

  const handleAddressProofUpload = (file) => {
    console.log(file)
  }

  const addressDropZone = useDropzone({ onDrop: handleAddressProofUpload });

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'white', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Documents</legend>
     
        <Grid item xs={12} sm={6}>
          <Box {...addressDropZone.getRootProps()} sx={{ border: 1, borderColor: '#bfbfbf', borderRadius: 2, p: 2.6, textAlign: 'center' }}>
            <TextField 
            {...addressDropZone.getInputProps()} 
            {...register('documents',{required : "Document required"})} 
            error={!!errors.documents}
            helperText={errors.documents?.message}
            />
            <Typography variant='body2' color={'text.secondary'}>
              <UploadFile /> Upload Documents
            </Typography>
          </Box>
          <Typography variant="caption" display="block" textAlign="center">Adress Proof</Typography>
        </Grid>
      </fieldset>
    </Box>
  );
}
