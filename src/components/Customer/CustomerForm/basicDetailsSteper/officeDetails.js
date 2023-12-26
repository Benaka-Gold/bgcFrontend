import React, { useEffect, useState } from "react";
import {Box, FormControl, InputLabel, MenuItem,Select, FormHelperText, styled, Grid,Button, IconButton, TextField, Typography} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Loader from "../../../Loader";
import { useFormContext, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { uploadfiles , deleteFile, getFile} from "../../../../apis/fileUpload";
import { useLocation } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Card, CardMedia, CardActionArea, CardContent, CardActions } from '@mui/material';


function VerificationalForm() {
  const { register, control, setValue, getValues, formState: { errors } } = useFormContext();
  const [customerImagePreview, setCustomerImagePreview] = useState(null);
  const [loading, setLoading] = useState(false)
  const [panDetailsPreview, setPanDetailsPreview] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [addressProofPreview, setAddressProofPreview] = useState(null);
  let location = useLocation();
  const query = new URLSearchParams(location.search);


  useEffect(() => {
    register('customerImage', { required: 'Customer Image is required' });
    register('panDetails.number', { required: 'PAN number is required' });
    register('panDetails.file', { required: 'PAN image is required' });
  }, [register]);

  

  

  const getImagePreview = async (imageType) => {
    let imageId = '';
    if( imageType === 'customerImage'){
      imageId = getValues(`${imageType}`);
    }else{
      imageId = getValues(`${imageType}.file`);
    }
    if (!imageId) {
       return 
    }else {
      try {
        const response = await getFile(imageId); 
        const imageUrl = response?.data?.data; 
        switch (imageType) {
            case 'customerImage':
                setCustomerImagePreview(imageUrl);
                break;
            case 'panDetails':
                setPanDetailsPreview(imageUrl);
                break;
            case 'idProof':
                setIdProofPreview(imageUrl);
                break;
            case 'addressProof':
                setAddressProofPreview(imageUrl);
                break;
            default:
                console.error("Unknown image type:", imageType);
        }
    } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
    }
    }
};

useEffect(() => {
    getImagePreview('customerImage');
    getImagePreview('panDetails');
    getImagePreview('idProof');
    getImagePreview('addressProof');
}, []);

  useEffect(() => {
    register('customerImage', { required: 'Customer Image is required' });
  }, [register]);

  let name = getValues('name')
  const handleImageChange = async (event, imageType) => {
    setLoading(true);
    const file = event.target.files[0];
    try {
            const filePreviewUrl = URL.createObjectURL(file);
            const res = await uploadfiles(file, "customer", name);
            console.log(res);
            if (res.success) {
              if(imageType ==='customerImage'){
                setValue(`${imageType}`, res.data._id, { shouldValidate: true });
              }else{
                setValue(`${imageType}.file`, res.data._id, { shouldValidate: true });
              }
                switch (imageType) {
                    case 'customerImage':
                        setCustomerImagePreview(filePreviewUrl);
                        break;
                    case 'panDetails':
                        setPanDetailsPreview(filePreviewUrl);
                        break;
                    case 'idProof':
                        setIdProofPreview(filePreviewUrl);
                        break;
                    case 'addressProof':
                        setAddressProofPreview(filePreviewUrl);
                        break;
                    default:
                        break;
                }
                enqueueSnackbar("Uploaded successfully!", { variant: "success" });
            } else {
                throw new Error(res.error || 'File upload failed');
            }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
        setLoading(false);
    }
  };

  const removeImage = async (imageType) => {
    setLoading(true);
    let fileId = getValues(`${imageType}.file`);
    if(imageType === 'customerImage'){
      fileId = getValues(`${imageType}`);
    }else{
      fileId = getValues(`${imageType}.file`);
    }
    if (fileId) {
        try {
            const isSuccess = await deleteFile(fileId);
            if (isSuccess) {
                setValue(`${imageType}.file`, null);
                switch (imageType) {
                    case 'customerImage':
                        setCustomerImagePreview(null);
                        break;
                    case 'panDetails':
                        setPanDetailsPreview(null);
                        break;
                    case 'idProof':
                        setIdProofPreview(null);
                        break;
                    case 'addressProof':
                        setAddressProofPreview(null);
                        break;
                    default:
                        console.error("Unknown image type:", imageType);
                        break;
                }
                enqueueSnackbar("Deleted successfully!", { variant: "success" });
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }
};

const renderImageInput = (imageType, preview, handleCustomerImageChange, label) => {
  return (
    <Box sx={{ mt: 2, textAlign: 'center', position: 'relative' }}>
      {preview ? (
         <Card sx={{ display: 'flex', width: '100%', height: 'auto' , p:0}}> 
         <CardActionArea sx={{ width: '100%', height: '100%', p:0 }}>
           <CardMedia
             component="img"
             sx={{ width: '100%', height: '100%', objectFit: 'cover', p:0 }} 
             image={preview}
             alt="Preview"
           />
           <IconButton onClick={() => removeImage(imageType)} sx={{ position: 'absolute', top: 0, right: 0, color: 'black' }}>
             <CloseIcon />
           </IconButton>
         </CardActionArea>
       </Card>
      ) : (
        <>
        <input accept="image/*" id={`${imageType}-upload`} type="file" onChange={(e) => handleCustomerImageChange(e, imageType)} style={{ display: 'none' }} rules={{ required:`${imageType}  file is required`}} />
        <label htmlFor={`${imageType}-upload`}>
          <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{width:'100%', p:1}}>
          </Button>
        </label>
      </>
      )}
    </Box>
  );
};

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, margin: 'auto', m:0, p:0 }}>
      <Typography variant="h6" sx={{mb:1}}>KYC Detils</Typography>
      <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend style={{p:2}} >PAN</legend>
            <Card  sx={{mb: 2, display:'flex', p:0, m:0, boxShadow:'none', mt:0}} >
              <CardContent >
                <FormControl fullWidth margin="normal">
              <Controller
                name="panDetails.number"
                control={control}
                defaultValue=""
                rules={{ required: "PAN number is required" }}
                render={({ field }) => (
                  <TextField {...field} id="pan-number"  variant="outlined" label='Pan Number' />
                )}
              />
              {errors.panDetails?.number && <FormHelperText error>{errors.panDetails.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions>
                {renderImageInput('panDetails', panDetailsPreview, handleImageChange, 'Upload PAN')}
              </CardActions>
            </Card>
            </fieldset>

            <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend >ID Proof</legend>
            <Card  sx={{ mb: 2, display:'flex', p:0 , m:0, boxShadow:'none', mt:0}}>
              <CardContent sx={{width:'50%'}} >
                <FormControl fullWidth margin="normal">
                <InputLabel id="idProof-idType-label">ID Type</InputLabel>
                <Controller name="idProof.idType"  control={control}  rules={{ required: "ID type is required" }}
                  render={({ field }) => (
                    <Select {...field} labelId="idProof-idType-label" label="ID Type">
                    <MenuItem value="Passport">Passport</MenuItem>
                      <MenuItem value="Driving License">Driving License</MenuItem>
                      <MenuItem value="Voter's Id">Voter's Id</MenuItem>
                      <MenuItem value="Ration Card">Ration Card</MenuItem>
                      <MenuItem value="Govt ID Card">Govt ID Card</MenuItem>
                      <MenuItem value="Aadhar">Aadhar</MenuItem>
                    </Select>
                  )}
                />
                {errors.idProof?.idType && <Typography color="error">{errors.idProof?.idType?.message}</Typography>}
              </FormControl>

              <FormControl fullWidth margin="normal">
              <Controller
                name="idProof.number"
                control={control}
                defaultValue=""
                rules={{ required: "IdProof number is required" }}
                render={({ field }) => (
                  <TextField {...field} id="pan-number"  variant="outlined" label='IdProof Number' />
                )}
              />
              {errors.IdProof?.number && <FormHelperText error>{errors.IdProof.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions sx={{width:'50%'}}> 
              {renderImageInput('idProof', idProofPreview, handleImageChange, 'Upload IdProof')}
              </CardActions>
            </Card>
            </fieldset>

            <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend >Address Proof</legend>
            <Card  sx={{ mb: 2 ,display:'flex', p:0, m:0, boxShadow:'none', mt:0}}>
              <CardContent sx={{width:'50%'}} >
                <FormControl fullWidth margin="normal">
                <InputLabel id="addressProof-idType-label">Address Type</InputLabel>
                <Controller
                  name="addressProof.idType"
                  control={control}
                  rules={{ required: "Address type is required" }}
                  render={({ field }) => (
                    <Select {...field} labelId="addressProof-idType-label" label="Address Type">
                      <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                      <MenuItem value="Driving License">Driving License</MenuItem>
                      <MenuItem value="Voter's Id">Voter's Id</MenuItem>
                      <MenuItem value="Ration Card">Ration Card</MenuItem>
                      <MenuItem value="Gas Bill">Gas Bill</MenuItem>
                      <MenuItem value="Electricity Bill">Electricity Bill</MenuItem>
                      <MenuItem value="BSNL Bill">BSNL Bill</MenuItem>
                      <MenuItem value="Rental Agreement">Rental Agreement</MenuItem>
                      <MenuItem value="Purchase Deed">Purchase Deed</MenuItem>
                      <MenuItem value="Bank Passbook">Bank Passbook</MenuItem>
                    </Select>
                  )}
                />
                {errors.addressProof?.idType && <Typography color="error">{errors.addressProof?.idType?.message}</Typography>}
              </FormControl>

            <FormControl fullWidth margin="normal">
              <Controller
                name="addressProof.number"
                control={control}
                defaultValue=""
                rules={{ required: "addressProof number is required" }}
                render={({ field }) => (
                  <TextField {...field} id="pan-number"  variant="outlined" label='AddressProof Number' />
                )}
              />
              {errors.addressProof?.number && <FormHelperText error>{errors.addressProof.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions sx={{width:'50%'}}>
              {renderImageInput('addressProof', addressProofPreview, handleImageChange, 'Upload addressProof')}
              </CardActions>
            </Card>
            </fieldset>

            <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend >Customer Image</legend>
          {renderImageInput('customerImage', customerImagePreview, handleImageChange, 'Upload Customer Image')}
          </fieldset>
        <Loader loading={loading} />
      </Box>
    </LocalizationProvider>
  </SnackbarProvider>
  )
}

export default VerificationalForm;
