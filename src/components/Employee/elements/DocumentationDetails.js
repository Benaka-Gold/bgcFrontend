import React, { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Typography, Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { uploadfiles,deleteFile } from '../../../apis/fileUpload';

export function DocumentationDetails() {
  const { register, setValue, getValues, formState: { errors }, setError, clearErrors } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState({});

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const existingImageId = getValues("photo");
      if (existingImageId) {
        await deleteFile(existingImageId);
      }

      const file = acceptedFiles[0];
      const response = await uploadfiles(file);

      if (response.data._id) {
        setValue("photo", response.data._id);
      }
      // Handle errors here if upload failed
    },
    [getValues, setValue]
  );

  const handleUpload = async (docType, files) => {
    if (files.length === 0) {
      setError(`documents.${docType}`, { type: "required", message: `${docType} is required` });
      return;
    } else {
      clearErrors(`documents.${docType}`);
    }

    for (const file of files) {
      try {
        const response = await uploadfiles(file);
        if (response.data._id) {
          const currentDocuments = getValues('documents') || [];
          const updatedDocuments = [...currentDocuments, { docType, docId: response.data._id }];
          setValue('documents', updatedDocuments);
          setSelectedFiles(prev => ({ ...prev, [docType]: file.name }));
        } else {
          throw new Error('File upload did not return an ID.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(`documents.${docType}`, { type: "uploadError", message: error.message || 'Error occurred during upload' });
      }
    }
  };

  const addressProofDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('Address Proof', acceptedFiles),
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf" : [".pdf"]
    },
  });

  const idProofDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('ID Proof', acceptedFiles),
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf" : [".pdf"]
    },
  });

  const photoDropzone = useDropzone({
    onDrop: onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf" : [".pdf"]
    },
  });

  const educationCertificateDropzone = useDropzone({
    onDrop: (acceptedFiles) => handleUpload('Educational Certificate', acceptedFiles),
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf" : [".pdf"]
    },
  });

  const renderDropzone = (dropzone, label, fieldName) => {
    return (
      <Grid item xs={12} sm={6}>
        <Box {...dropzone.getRootProps()} sx={{ border: 1, borderColor: '#bfbfbf', borderRadius: 2, p: 2, textAlign: 'center' }}>
          <input {...dropzone.getInputProps()}  />
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
          {renderDropzone(addressProofDropzone, 'Address Proof', 'documents.addressProof')}
          {renderDropzone(idProofDropzone, 'ID Proof', 'documents.idProof')}
          {renderDropzone(photoDropzone, 'Photo of the Employee', 'photo')}
          {renderDropzone(educationCertificateDropzone, 'Educational Certificate', 'documents.educationCertificate')}
        </Grid>
      </fieldset>
    </Box>
  );
}
