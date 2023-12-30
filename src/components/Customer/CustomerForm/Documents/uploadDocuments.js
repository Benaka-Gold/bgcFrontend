import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, IconButton, Typography, Select, InputLabel, MenuItem , FormControl} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadfiles } from '../../../../apis/fileUpload';
import { updateCustomer,getCustomerById } from '../../../../apis/customer';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteFile ,getFile} from '../../../../apis/fileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { updateTask } from '../../../../apis/task';
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';
import { updateBusiness , getBussiness} from '../../../../apis/business';

import Loader from '../../../Loader';

function VerificationDocuments() {
  const [imagePreviews, setImagePreviews] = useState({});
  const [customerData, setCustomerData] = useState([])
  const [assignedTask, setAssignedTask] = useState()
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState('')
  let location = useLocation();
  let navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');

  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      agreementOfPurchase: '',
      offerLetterOwnershipDeclaration: '',
      noc: '',
      authorizationLetter: ''
    }
  });

  
  useEffect(() => {
    let task = async () => {
      let response = await fetchAssignedTask(customerId)
      setAssignedTask(response)
      const businessIds = response[0].businessId
      setBusinessId(businessIds)
        }
    task()
  }, [])

  const fetchBusiness = async () => {
    setLoading(true)
    if(businessId){
    try {
      let res = await getBussiness(businessId);
      if (res.data) {
        const updates = {};
        const newImagePreviews = {};
        const fileFetchPromises = [];
        for (const key in res.data) {
          if (res.data[key] && typeof res.data[key] === 'object') {
            for (const subKey in res.data[key]) {
              const value = res?.data[key][subKey];
              if (subKey === 'file' && value) {
                fileFetchPromises.push(
                  getFile(value).then(fileResponse => {
                    if (fileResponse && fileResponse.data) {
                      newImagePreviews[`${key}.${subKey}`] = fileResponse.data.data;
                      updates[`${key}.${subKey}`] = value;
                    }
                  })
                );
              } else {
                updates[`${key}.${subKey}`] = value;
              }
            }
          } else {
            if (['agreementOfPurchase', 'offerLetterOwnershipDeclaration', 'noc', 'authorizationLetter'].includes(key) && res.data[key]) {
              fileFetchPromises.push(
                getFile(res.data[key]).then(fileResponse => {
                  if (fileResponse && fileResponse.data) {
                    newImagePreviews[key] = fileResponse.data.data;
                    updates[key] = res.data[key];
                  }
                })
              );
            } else {
              updates[key] = res.data[key];
            }
          }
        }
        await Promise.all(fileFetchPromises);
        Object.entries(updates).forEach(([key, value]) => setValue(key, value));
        setImagePreviews(newImagePreviews);
        Object.entries(updates).forEach(([key, value]) => {
          setValue(key, value);
        });
      }
    } catch (error) {
       enqueueSnackbar({message:error.message, variant:'error'})
    } finally {
      setTimeout(()=>{
        setLoading(false)
      }, 250)
    }
  }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const handleFileUpload = async (e, fieldName) => {
    const { name } = customerData
    const file = e.target.files[0];
    const compressedImage = await compressImage(file);
    if (file) {
      try {
        const res = await uploadfiles(compressedImage, "customer", name && name);
        console.log(res);
        if (res.success) {
          
          setLoading(true)
          setTimeout(()=>{
            setValue(fieldName, res.data._id, { shouldValidate: true });
            setImagePreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(compressedImage) }));
            enqueueSnackbar("Uploaded successful!", { variant: "success" });
            setLoading(false)
            return res.data._id;
          }, 250)
        }
      } catch (error) {
        enqueueSnackbar({message : error.message ,variant : 'error'})
        console.log(error);
      }
    }
  };

  const compressImage = async (imageFile, quality = 0.5) => {
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

  const DeleteImagePreview = async (fieldName) => {
    const name = fieldName.replace('.file', '');
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isDocumentsUpload = false;
    try{
    const fileId = getValues(fieldName);
    if (fileId) {
      const isSuccess = await deleteFile(fileId);
      console.log(isSuccess);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      if (isSuccess && taskResponse.status === 200) {
        let updated = { ...getValues(), [name]: null };
        console.log(updated);
      let response = await updateBusiness(businessId, updated);
      if (response.status === 200) {
        enqueueSnackbar(`${name} Deleted Succesfully`, { variant: "success" });
      }
        setLoading(true)
        setTimeout(()=>{
          setImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[fieldName];
            return newPreviews;
          });
          setValue(fieldName, '');
        },250)
      }
    }
  }catch(error){
    enqueueSnackbar( error.message, { variant: "error" });
    console.log(error);
  }finally{
    setLoading(false)
  }
  };

  const onSubmit = async (data) => {
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isDocumentsUpload = true;
    setLoading(true)
    try{
      const response = await updateBusiness(businessId, data);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      if (response.status === 200 && taskResponse.status === 200) {
        enqueueSnackbar("Form Submitted", { variant: "success" });
      }
    } catch(error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } 
    finally {
      setTimeout(()=>{
        setLoading(false)
        navigate(`/executive/customerdetails?filter=${customerId}`);
      }, 500)
    }
  };

  const renderFileInput = (field, error, label) => {
    const fileUploaded = imagePreviews[field.name];

    return (
      <fieldset style={{border:'1px solid #c4c4c4', borderRadius:'5px', width:'100%'}}>
        <legend>{label}</legend>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        {/* <Box component="label" htmlFor={field.name} display={'flex'} justifyContent={'flex-start'} padding={'10px'} fontWeight={'bolder'} >{label}</Box> */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          {fileUploaded ? (
            <>
              <Box component="img" src={fileUploaded} alt="Preview" sx={{ width: 100, height: 100, objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px', }} />
              <IconButton onClick={() => DeleteImagePreview(field.name)} sx={{ ml: 1 }}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <input id={field.name} type="file"
                onChange={(e) => {
                  handleFileUpload(e, field.name)
                  field.onChange(e.target.files)
                }}
                style={{ display: 'none' }} ref={field.ref} />
              <label htmlFor={field.name}>
                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                  Upload
                </Button>
              </label>
            </>
          )}
        </Box>
        {error && <Box color="error.main" sx={{ mt: 1 }}>{error.message}</Box>}
      </Box>
      </fieldset>
    );
  };


  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <Box sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height: "auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, }}>
        <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
          <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2, cursor: "pointer" }} />
          <Typography variant="h5" sx={{ p: 2 }}>  Documents </Typography>
        </Box>
        <Box sx={{ height: "auto", display: "flex", alignContent: "center", justifyContent: "center", }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ margin: 2 }}>

              <Controller name="agreementOfPurchase" control={control} rules={{ required: "Agreement of purchase file is required" }}
                render={({ field, fieldState: { error } }) =>
                  renderFileInput(field, error, 'Agreement of Purchase')} />

              <Controller name="offerLetterOwnershipDeclaration" control={control} rules={{ required: "Offer letter file is required" }}
                render={({ field, fieldState: { error } }) => renderFileInput(field, error, 'Offer Letter Ownership Declaration')} />

              <Controller name="noc" control={control} rules={{ required: "NOC file is required" }}
                render={({ field, fieldState: { error } }) => renderFileInput(field, error, 'NOC')} />

              <Controller name="authorizationLetter" control={control} rules={{ required: "Authorization letter file is required" }}
                render={({ field, fieldState: { error } }) => renderFileInput(field, error, 'Authorization Letter')} />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                Submit
              </Button>
            </Box>
          </form>
        </Box>
        <Loader loading={loading} />
      </Box>
    </SnackbarProvider>
  );
}

export default VerificationDocuments;
