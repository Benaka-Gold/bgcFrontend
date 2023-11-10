import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { uploadfiles } from '../../../apis/fileUpload';

export function DocumentationDetails() {
  const { register, getValues, formState: { errors },setError, clearErrors, setValue } = useFormContext();
  console.log(getValues())
  // Helper function to handle file upload and set file reference in the form
  const handleUpload = async (docType, files) => {

    if (files.length === 0) {
      setError(`documents.${docType}`, {
        type: "required",
        message: `${docType} is required`
      });
      return; // Exit the function early as there's nothing to upload
    } else {
      clearErrors(`documents.${docType}`); // Clear errors if files are uploaded
    }

    for (const file of files) {
      try {
        // Call your API endpoint to upload the file
        const response = await uploadfiles(file);
        

        // Check if the response has the expected property '_id'
        if (response.data._id) {
          if (docType === 'Photo') {
            // If it's the employee's photo, update the 'photo' field in the form state
            setValue('photo', response.data._id);
          } else {
            // Otherwise, update the 'documents' array
            setValue('documents', [
              getValues('documents'), 
              { docType: docType, docFile: response.data._id }
            ]);
          }
        } else {
          // Handle the case where the '_id' isn't returned in the response
          throw new Error('File upload did not return an ID.');
         
        }
      } catch (error) {
        // Handle any errors in file upload here
        console.error('Error uploading file:', error);
        setError(`documents.${docType}`, {
          type: "uploadError",
          message: error.message || 'Error occurred during upload'
        });
      }
    }
  };

  // Define dropzone hooks for each document type
  const addressProofDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('Address Proof', acceptedFiles),
    multiple: false,
    accept: 'image/jpeg, image/png, application/pdf',
  });

  const idProofDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('ID Proof', acceptedFiles),
    multiple: false,
    accept: 'image/jpeg, image/png, application/pdf',
  });

  const photoDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('Photo', acceptedFiles),
    multiple: false,
    accept: 'image/jpeg, image/png, application/pdf',
  });

  const educationCertificateDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('Educational Certificate', acceptedFiles),
    multiple: false,
    accept: 'image/jpeg, image/png, application/pdf',
  });

  // Render helper function for a dropzone
  const renderDropzone = (dropzone, label) => {
    return (
      <Grid item xs={12} sm={6}>
        <Box {...dropzone.getRootProps()} sx={{ border: 1, borderColor: '#bfbfbf', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <input {...dropzone.getInputProps()} {...register(`documents.${label}`,{required : `${label} is required`, validate: files => files.length > 0 || `${label} file is required` })} />
          <Typography variant='body2' color={'text.secondary'}>
            <UploadIcon /> Click to upload File
          </Typography>
        </Box>
        <Typography variant="caption" display="block" textAlign="center">{label}</Typography>
        {errors.documents && errors.documents[label] && (
          <Typography color="error">{errors.documents[label].message}</Typography>
        )}
      </Grid>
    );
  };

  // Now use the dropzone variables defined with the useDropzone hook
  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'transparent', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Documents</legend>
        <Grid container spacing={2}>
          {renderDropzone(addressProofDropzone, 'Address Proof')}
          {renderDropzone(idProofDropzone, 'ID Proof')}
          {renderDropzone(photoDropzone, 'Photo of the Employee')}
          {renderDropzone(educationCertificateDropzone, 'Educational Certificate')}
          {errors.documents && (
            <Grid item xs={12}>
              <Typography color="error">{errors.documents.message}</Typography>
            </Grid>
          )}
        </Grid>
      </fieldset>
    </Box>
  );
}
