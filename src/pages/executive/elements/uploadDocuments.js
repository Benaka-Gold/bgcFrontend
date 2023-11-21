import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import {uploadfiles} from '../../../apis/fileUpload'

// Custom hook for creating a dropzone
function useCustomDropzone(docType, handleUpload) {
  return useDropzone({
    onDrop: (acceptedFiles) => handleUpload(docType, acceptedFiles),
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"]
    },
  });
}

 function VerificationForm() {
  const {
    setValue,
    getValues,
    formState: { errors },
    setError,
    clearErrors
  } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleUpload = async (docType, files) => {
    console.log(docType, files);
    if (files.length === 0) {
      setError(`documents.${docType}`, { type: "required", message: `${docType} is required` });
      return;
    } else {
      clearErrors(`documents.${docType}`);
    }

    for (const file of files) {
      try {
        const response = await uploadfiles(file);
        console.log(response);
        if (response.data._id) {
        //   const currentDocuments = getValues('documents') || [];
        //   const updatedDocuments = [...currentDocuments, { docType, docId: response.data._id }];
        //   setValue('documents', updatedDocuments);
        //   setSelectedFiles(prev => ({ ...prev, [docType]: file.name }));
        } else {
          throw new Error('File upload did not return an ID.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(`documents.${docType}`, { type: "uploadError", message: error.message || 'Error occurred during upload' });
      }
    }
  };

  // Use the custom hook for each document type
  const authorizationLetterDropzone = useCustomDropzone('Authorization Letter', handleUpload);
  const nocDropzone = useCustomDropzone('NOC', handleUpload);
  const agreementOfPurchaseDropzone = useCustomDropzone('Agreement of Purchase', handleUpload);
  const offerLetterDropzone = useCustomDropzone('Offer Letter', handleUpload);

  const renderDropzone = (dropzone, label) => {
    return (
      <Grid item xs={12} sm={6}>
        <Box {...dropzone.getRootProps()} sx={{ border: 1, borderColor: '#bfbfbf', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <input {...dropzone.getInputProps()} />
          <Typography variant='body2' color={'text.secondary'}>
            <UploadIcon /> Click to upload {label}
          </Typography>
          {selectedFiles[label] && <Typography variant="caption">{selectedFiles[label]}</Typography>}
        </Box>
        <Typography variant="caption" display="block" textAlign="center">{label}</Typography>
        {errors.documents && errors.documents[label] && (
          <Typography color="error">{errors.documents[label].message}</Typography>
        )}
      </Grid>
    );
  };

  return (
    <Box sx={{ padding: '16px', margin: '16px' }}>
      <fieldset style={{ borderColor: 'transparent', borderRadius: "5px" }}>
        <legend style={{ textAlign: 'center' }}>Documents</legend>
        <Grid container spacing={2}>
          {renderDropzone(authorizationLetterDropzone, 'Authorization Letter')}
          {renderDropzone(nocDropzone, 'NOC')}
          {renderDropzone(agreementOfPurchaseDropzone, 'Agreement of Purchase')}
          {renderDropzone(offerLetterDropzone, 'Offer Letter')}
        </Grid>
      </fieldset>
    </Box>
  );
}
export default VerificationForm;