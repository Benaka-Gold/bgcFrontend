import React, { useEffect, useState } from "react";
import {Box, FormControl, InputLabel, MenuItem,Select, FormHelperText, styled, Grid,Button, IconButton} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Loader from "../../../Loader";
import { useFormContext, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { uploadfiles , deleteFile, getFile} from "../../../../apis/fileUpload";
import { updateCustomer } from "../../../../apis/customer";
import { useLocation } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";


function VerificationalForm() {
  const { register, control, setValue, getValues, formState: { errors } } = useFormContext();
  const [customerImagePreview, setCustomerImagePreview] = useState(null);
  let location = useLocation();
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');
  const [loading, setLoading] = useState(false)
  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: '100%',
  }));

  const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    fontSize: '0.875rem',
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.divider,
    '&:focus': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  }));

  const getCustomerImage = async () => {
    const ImageId = getValues('customerImage')
    if (ImageId) {
      const response = await getFile(ImageId)
      setCustomerImagePreview(response?.data?.data)
    }
  }
  useEffect(() => {
    getCustomerImage()
  }, [])
  useEffect(() => {
    register('customerImage', { required: 'Customer Image is required' });
  }, [register]);

  let name = getValues('name')
  const handleCustomerImageChange = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    try {
        let compressedImage = await compressImage(file);
        if (compressedImage) {
            const filePreviewUrl = URL.createObjectURL(compressedImage);
            setCustomerImagePreview(filePreviewUrl); // Preview the image first
            const res = await uploadfiles(compressedImage, "customer", name);
            if (res.success) {
                setValue('customerImage', res.data._id, { shouldValidate: true });
                enqueueSnackbar("Uploaded successful!", { variant: "success" });
            } else {
                throw new Error(res.error || 'File upload failed');
            }
        }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "success" })
    } finally {
        setLoading(false);
    }
};
  const compressImage = async (imageFile, quality = 0.6) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], imageFile.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = (error) => reject(error);
    });
  };


  const removeCustomerImage = async () => {
    const fileId = getValues('customerImage');
    if (fileId) {
      setLoading(true);
      try {
        const isSuccess = await deleteFile(fileId);
        if (isSuccess) {
          setCustomerImagePreview(null);
          setValue('customerImage', null);
          let updated = { ...getValues(), customerImage: null };
          const response = await updateCustomer(customerId, updated);
          if (response.status === 200) {
            const status = JSON.parse(localStorage.getItem('status')) || {};
            status.isBasicDetails = false;
            localStorage.setItem('status', JSON.stringify(status));
            enqueueSnackbar("Deleted successful!", { variant: "success" });
          }
        }
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "success" })
      } finally {
        setLoading(false);
      }
    }
  };

  const renderCustomerImageInput = () => (
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      {customerImagePreview ? (
        <>
          <Box component="img" src={customerImagePreview} alt="Preview" sx={{ width: 100, height: 100, objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }} />
          <IconButton onClick={removeCustomerImage} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </>
      ) : (
        <>
          <input accept="image/*"  id="customer-image-upload" type="file" onChange={handleCustomerImageChange} style={{ display: 'none' }} />
          <label htmlFor="customer-image-upload">
            <Button variant="contained" component="span" startIcon={<CloudUploadIcon /> }  fullWidth>
              Upload Image
            </Button>
          </label>
        </>
      )}
    </Box>
  );

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 800, margin: 'auto' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StyledTextareaAutosize minRows={3} placeholder="Current Residential Address"name="currentAddress" style={{ width: '100%', margin: '8px 0' }}
              {...register('currentAddress', { required: 'Current Residential Address  is required' })}
              error={!!errors.currentAddress}  helperText={errors.currentAddress?.message} />
          </Grid>

          {/* <Grid item xs={12} md={6}>
            <StyledTextareaAutosize minRows={3} placeholder="Office/Business Address" name="officeBusinessAddress"
              {...register('officeBusinessAddress', { required: 'officeBusinessAddress  is required' })}
              error={!!errors.officeBusinessAddress} helperText={errors.officeBusinessAddress?.message}  style={{ width: '100%', margin: '8px 0' }}/>
          </Grid> */}

          {/* <Grid item xs={12} md={6}>
            <StyledFormControl error={!!errors.residentialStatus} fullWidth>
              <InputLabel id="residential-status-label">Residential Status</InputLabel>
              <Controller name="residentialStatus"  control={control} rules={{ required: 'Residential status is required' }}
                render={({ field }) => (
                  <Select labelId="residential-status-label" id="residential-status" label="Residential Status" {...field}>
                    <MenuItem value="Indian">Indian</MenuItem>
                    <MenuItem value="NRI">NRI</MenuItem>
                    <MenuItem value="PIO">PIO</MenuItem>
                    <MenuItem value="Foreign Resident">Foreign Resident</MenuItem>
                    <MenuItem value="Dual Citizen">Dual Citizen</MenuItem>
                  </Select>
                )}
              />
              {errors.residentialStatus && <FormHelperText>{errors.residentialStatus.message}</FormHelperText>}
            </StyledFormControl>
          </Grid> */}
          <Grid item xs={6} md={6} >
            {renderCustomerImageInput()}
            {errors.customerImage && <FormHelperText error>{errors.customerImage.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Loader loading={loading} />
      </Box>
    </LocalizationProvider>
    </SnackbarProvider>
  )
}

export default VerificationalForm;
