import React, { useEffect, useState } from "react";
import {Box, FormControl, InputLabel, MenuItem,Select, FormHelperText, styled, Grid,Button, IconButton, TextField, Typography} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fetchAssignedTask } from "../CustomerBasic/subComponent/CustomerVerification";
import Loader from "../../../Loader";
import { useFormContext, Controller } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { updateTask } from "../../../../apis/task";
import CloseIcon from '@mui/icons-material/Close';
import { uploadfiles , deleteFile, getFile} from "../../../../apis/fileUpload";
import { useLocation } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Card, CardMedia, CardActionArea, CardContent, CardActions } from '@mui/material';
import { updateCustomer } from "../../../../apis/customer";
function VerificationalForm() {
  const { register, control, setValue, getValues, formState: { errors } } = useFormContext();
  const [customerImagePreview, setCustomerImagePreview] = useState(null);
  const [loading, setLoading] = useState(false)
  const [assignedTask, setAssignedTask] = useState([])
  const [panDetailsPreview, setPanDetailsPreview] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [addressProofPreview, setAddressProofPreview] = useState(null);
  let location = useLocation();
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');





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
const getTask = async()=>{
  try{
  const response = await fetchAssignedTask(customerId)
  setAssignedTask(response)
  }catch(error){
    enqueueSnackbar(error.message, { variant: "error" });
  }
}
useEffect(() => {
    getImagePreview('customerImage');
    getImagePreview('panDetails');
    getImagePreview('idProof');
    getImagePreview('addressProof');
    getTask()
}, []);

  useEffect(() => {
    register('customerImage', { required: 'Customer Image is required' });
    register('panDetails.file', { required: 'PAN image is required' });
    register('idProof.file', { required: 'ID Proof is required' });
    register('addressProof.file', { required: 'Address Proof is required' });
  }, [register]);

  const handleImageChange = async (event, imageType) => {
    setLoading(true); 
  
    const file = event.target.files[0]; 
    if (!file) {
      enqueueSnackbar("Please select a file to upload.", { variant: "error" });
      setLoading(false);
      return;
    }
    try {
      const filePreviewUrl = URL.createObjectURL(file);
      const name = getValues('name'); // Assuming 'name' is a state or derived value
      const res = await uploadfiles(file, "customer", name);
      if (!res.success) {
        throw new Error(res.error || 'File upload failed');
      }
      const fieldToUpdate = imageType === 'customerImage' ? imageType : `${imageType}.file`;
      setValue(fieldToUpdate, res.data._id, { shouldValidate: true });
      const previewUpdater = {
        customerImage: setCustomerImagePreview,
        panDetails: setPanDetailsPreview,
        idProof: setIdProofPreview,
        addressProof: setAddressProofPreview
      };
      const updatePreview = previewUpdater[imageType];
      if (updatePreview) {
        updatePreview(filePreviewUrl);
      } else {
        console.error("Unknown image type:", imageType);
      }
      enqueueSnackbar("Uploaded successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setLoading(false); 
    }
  };
  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const removeImage = async (imageType) => {
    setLoading(true);
    let fileId = getValues(`${imageType}.file`) || getValues(`${imageType}`);
    if (!fileId) {
        enqueueSnackbar("No image to remove.", { variant: "error" });
        setLoading(false);
        return; 
    }
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
      updatedTask.state = {};
    }
    updatedTask.state.isBasicDetails = false;
    try {
        const isSuccess = await deleteFile(fileId);
        const taskResponse = await updateTask(updatedTask._id, updatedTask)
        if (isSuccess) {
            setValue(`${imageType}.file`, null);
            const updated = imageType === 'customerImage' ? { [`${imageType}`]: null } : { [`${imageType}.file`]: null };
            await updateCustomer(customerId, updated);
            enqueueSnackbar(`${imageType} Deleted`, { variant: "success" });
            if(imageType === 'customerImage') setCustomerImagePreview(null);
            else if(imageType === 'panDetails') setPanDetailsPreview(null);
            else if(imageType === 'idProof') setIdProofPreview(null);
            else if(imageType === 'addressProof') setAddressProofPreview(null);
        }
    } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
    } finally {
        setLoading(false);
    }
};


const renderImageInput = (imageType, preview, handleCustomerImageChange, label, errors) => (
  <Box sx={{ mt: 2, textAlign: 'center', position: 'relative' }}>
    {preview ? (
      <Card sx={{ display: 'flex', width: '100%', height: 'auto', p:0 }}> 
        <CardActionArea sx={{ width: '100%', height: '30%', p:0 }}>
          <CardMedia
            component="img"
            sx={{ width: '100%', height: '50%', objectFit: 'cover', p:0 }} 
            image={preview}
            alt={`${imageType} preview`}
          />
          <IconButton onClick={() => removeImage(imageType)} sx={{ position: 'absolute', top: 0, right: 0, color: 'black' }}>
            <CloseIcon />
          </IconButton>
        </CardActionArea>
      </Card>
    ) : (
      <>
        <input
          accept="image/*"
          id={`${imageType}-upload`}
          type="file"
          onChange={(e) => handleCustomerImageChange(e, imageType)}
          style={{ display: 'none' }}
        />
        <label htmlFor={`${imageType}-upload`}>
          <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{width:'100%', p:1}}>
          </Button>
        </label>
        {errors && <Typography color="error" sx={{ mt: 1 }}>{errors.message}</Typography>}
      </>
    )}
  </Box>
);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{width:'100%', height:'auto', display:'flex', justifyContent:'center'}}>
      <Box sx={{ maxWidth: 800, margin: 'auto', m:0, p:0 }}>
      <Typography variant="h6" sx={{mb:1}}>KYC</Typography>
      <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend style={{p:2}} >PAN</legend>
            <Card  sx={{mb: 2, display:'flex', p:0, m:0, boxShadow:'none', mt:0}} >
              <CardContent sx={{width:'50%'}}>
                <FormControl fullWidth margin="normal">
              <Controller
                name="panDetails.number"
                control={control}
                defaultValue=""
                rules={{ required: "PAN number is required" }}
                render={({ field }) => (
                  <TextField {...field} id="pan-number"  variant="outlined" label='Pan Number' InputProps={{ style: { fontSize: '15px' } }}/>
                )}
              />
              {errors.panDetails?.number && <FormHelperText error>{errors.panDetails.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions sx={{width:'50%', display:'flex', flexDirection:'column'}}>
                {renderImageInput('panDetails', panDetailsPreview, handleImageChange, 'Upload PAN', errors['panDetails.file'])}
                {errors.panDetails?.file && (<Typography color="error" sx={{ mt: 1 }}>{errors.panDetails.file.message}</Typography>)}
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
                    <Select {...field} labelId="idProof-idType-label" label="ID Type" >
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
              <Controller name="idProof.number" control={control} defaultValue=""
                rules={{ required: "IdProof number is required" }} render={({ field }) => (
                  <TextField {...field} id="pan-number"  variant="outlined" label='IdProof Number'   InputProps={{ style: { fontSize: '15px' } }}/> )}/>
              {errors.IdProof?.number && <FormHelperText error>{errors.IdProof.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions sx={{width:'50%', display:'flex', flexDirection:'column'}}> 
              {renderImageInput('idProof', idProofPreview, handleImageChange, 'Upload IdProof',errors['idProof.file'])}
              {errors.idProof?.file && (<Typography color="error" sx={{ mt: 1 }}>{errors.idProof.file.message}</Typography>)}
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
                  <TextField {...field} id="pan-number"  variant="outlined" label='AddressProof Number'   InputProps={{ style: { fontSize: '15px' } }}/>
                )}
              />
              {errors.addressProof?.number && <FormHelperText error>{errors.addressProof.number.message}</FormHelperText>}
            </FormControl>
              </CardContent>
              <CardActions sx={{width:'50%', display:'flex', flexDirection:'column'}}>
              {renderImageInput('addressProof', addressProofPreview, handleImageChange, 'Upload addressProof',errors)}
              {errors.addressProof?.file && (<Typography color="error" sx={{ mt: 1 }}>{errors.addressProof.file.message}</Typography>)}
              </CardActions>
            </Card>
            </fieldset>

            <fieldset style={{width:'100%', borderRadius:'5px', border:'1px solid #c4c4c4'}}>
          <legend >Customer Image</legend>
          {renderImageInput('customerImage', customerImagePreview, handleImageChange, 'Upload Customer Image',errors)}
          {errors.customerImage && (<Typography color="error" sx={{ mt: 1 }}>{errors.customerImage.message}</Typography>)}
          </fieldset>
        <Loader loading={loading} />
      </Box>
      </Box>
    </LocalizationProvider>
  </SnackbarProvider>
  );
}

export default VerificationalForm;
