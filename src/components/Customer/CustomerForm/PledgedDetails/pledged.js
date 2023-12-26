import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCustomerById } from '../../../../apis/customer';
import { uploadfiles, deleteFile, getFile } from '../../../../apis/fileUpload';
import { updateBusiness, getBussiness } from '../../../../apis/business';
import { executiveTask,updateTask } from '../../../../apis/task';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Loader from '../../../Loader';

function PledgedForm() {
    const { register, handleSubmit, setValue, control, getValues, formState: { errors } } = useForm();
    const [imagePreviews, setImagePreviews] = useState({});
    const [nbfcimagePreviews, setNbfcImagePreviews] = useState({})
    const [customerData, setCustomerData] = useState([])
    const [businessId, setBussinessId] = useState('')
    const [loading, setLoading] = useState(false)
    const [assignedTask, setAssignedTask] = useState()
    let location = useLocation();
    let navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    let customerId = query.get('filter');
    
    const fetchCustomerAndBusinessData = async () => {
        try {
            const customerResponse = await getCustomerById(customerId);
            if (customerResponse.status === 200) {
                setCustomerData(customerResponse.data);
                const businessId = customerResponse.data.businessId[0];
                setBussinessId(businessId);
                const businessResponse = await getBussiness(businessId);
                if (businessResponse.status === 200) {
                    setValue("releasingAmount", businessResponse.data.releasingAmount);
                    setValue("netWeight", businessResponse.data.netWeight);
                    setValue("grossWeight", businessResponse.data.grossWeight);
                    const newPreviews = {};
                    if (businessResponse.data.pledgeCopy) {
                        const pledgeResponse = await getFile(businessResponse.data.pledgeCopy);
                        if (pledgeResponse.status === 200) {
                            newPreviews.pledgeCopy = pledgeResponse.data.data;
                            setValue("pledgeCopy", businessResponse.data.pledgeCopy);
                        }
                    }
                    if (businessResponse.data.nbfcBankDetails) {
                        const nbfcResponse = await getFile(businessResponse.data.nbfcBankDetails);
                        if (nbfcResponse.status === 200) {
                            newPreviews.nbfcBankDetails = nbfcResponse.data.data;
                            setValue("nbfcBankDetails", businessResponse.data.nbfcBankDetails);
                        }
                    }
                    setImagePreviews(newPreviews);
                }
            }
        } catch (error) {
            enqueueSnackbar({message: error.message, variant: 'error'});
        }
    };
    
    useEffect(() => {
        fetchCustomerAndBusinessData();
    }, [customerId, setValue]);
    const Task = assignedTask?.find(lead => lead.customerId._id === customerId);

    const onSubmit = async (data) => {
        setLoading(true)
        const updatedTask = { ...Task };
        if (!updatedTask.state) {
        updatedTask.state = {};
         }
        updatedTask.state.isPledgedDoc = true;
        try {
            const response = await updateBusiness(businessId, data)
            const taskResponse = await updateTask(updatedTask._id, updatedTask)
            if(response.status === 200 && taskResponse.status === 200){
                setTimeout(()=>{
                    navigate(`/executive/customerdetails?filter=${customerId}`);
                    setLoading(false)
                }, 250)
            }
        } catch (error) {
            enqueueSnackbar({message : error.message ,variant : 'error'})
        }
    };

    const handleFileUpload = async (e, fieldName) => {
        const { name } = customerData
        const file = e.target.files[0];
        setLoading(true)
        if (file) {
            try {
                let res = {}
                if(fieldName === "nbfcBankDetails"){
                    res = await uploadfiles(file, "customer", `${name}/nbfcBankDetails`);
                }else{
                 res = await uploadfiles(file, "customer", `${name}/pledgeCopy`);
                }
                if (res.success) {
                    setTimeout(()=>{
                        setValue(fieldName, res.data._id, { shouldValidate: true });
                        setImagePreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
                        enqueueSnackbar({message :'Image Uploaded' ,variant : 'success'})
                        setLoading(false)
                        return res.data._id;
                    },250)
                } 
            } catch (error) {
                console.error(error);
                enqueueSnackbar({message :error.message ,variant : 'error'})
            } 
        }
    };

    const DeleteImagePreview = async (fieldName, name) => {
        const fileId = getValues(fieldName);
        const updatedTask = { ...Task };
        if (!updatedTask.state) {
        updatedTask.state = {};
         }
        updatedTask.state.isPledgedDoc = false;
        setLoading(true);
        if (fileId) {
            try {
                let updatedBusiness = null
                const isSuccess = await deleteFile(fileId);
                if (isSuccess.status === 200) {
                    if(name === 'pledgeCopy') {
                        const taskResponse = await updateTask(updatedTask._id, updatedTask)
                        updatedBusiness = {pledgeCopy : null}
                        setImagePreviews(prev => ({ ...prev, pledgeCopy: undefined }));
                        const response = await updateBusiness(businessId, updatedBusiness )
                        enqueueSnackbar({message: 'Pledged Copy Delete', variant:'success'})
                    } else if(name === 'nbfcBankDetails') {
                        const taskResponse = await updateTask(updatedTask._id, updatedTask)
                        setImagePreviews(prev => ({ ...prev, nbfcBankDetails: undefined }));
                        updatedBusiness = {nbfcBankDetails : null}
                        const response = await updateBusiness(businessId, updatedBusiness )
                        enqueueSnackbar({message: 'NBFC Bank Details', variant:'success'})
                    }
                    setValue(fieldName, '');
                } else {
                    enqueueSnackbar({message : "Something went wrong",variant : 'error'});
                }
            } catch (error) {
                enqueueSnackbar({message: error.message, variant: 'error'});
            } finally {
                setLoading(false);
            }
        }
    };
    const fetchAssignedTask = async () => {
        try {
          const res = await executiveTask();
          if (res?.data?.data) {
            const filteredCustomer = res.data.data.filter(item => item.customerId._id === customerId);
            setAssignedTask(filteredCustomer)
          } else {
            console.error('No data received from executiveTask');
          }
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
          alert(error.message)
        }
      };
    
      useEffect(()=>{
        fetchAssignedTask()
      },[])
    const renderFileInput = (field, error, label) => {
        const fileUploaded = imagePreviews[field.name];
        return (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography component="label" htmlFor={field.name} sx={{ fontWeight: 'bold', display: 'block' }}>
                    {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {fileUploaded ? (
                        <>
                            <img src={fileUploaded} alt="Preview" style={{ width: 100, height: 100, objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }} />
                            <IconButton onClick={() => DeleteImagePreview(field.name, field.name)} sx={{ ml: 1 }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <input id={field.name} type="file"
                                onChange={(e) => {
                                    handleFileUpload(e, field.name);
                                    field.onChange(e.target.files[0]);
                                }}
                                style={{ display: 'none' }} ref={field.ref} />
                            <label htmlFor={field.name}>
                                <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }}>
                                    Upload
                                </Button>
                            </label>
                        </>
                    )}
                </Box>
                {error && <Typography color="error.main" sx={{ mt: 1 }}>{error.message}</Typography>}
            </Box>
        );
    };

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Box
            sx={{
                width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" },
                height: "auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, mt: { lg: 5, sm: 5, xs: 0, md: 5 }
            }}>
            <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
                <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2, cursor: "pointer" }} />
                <Typography variant="h5" sx={{ p: 2 }}>Pledged Form </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: { lg: "30%", sm: '70%', xs: '90%', md: '70%' }, margin: 'auto' }} >
                <TextField fullWidth label="Releasing Amount" type='number'
                InputLabelProps={{ 
                    shrink: true,
                  }}
                    {...register("releasingAmount", {
                        required: "Releasing Amount is required",
                        valueAsNumber: true,
                        min: { value: 0.01, message: "Releasing Amount must be greater than 0" }
                    })}
                    error={!!errors.releasingAmount} helperText={errors.releasingAmount?.message} sx={{ mb: 2 }} />

                 <fieldset style={{marginBottom:"10px", border:'1px solid #c4c4c4', borderRadius:'5px'}}>
                    <legend>Pledged Copy</legend>
               
                <Controller name="pledgeCopy" control={control}
                    rules={{ required: "Pledged Copy is required" }}
                    render={({ field, fieldState: { error } }) => renderFileInput(field, error)} />
                     </fieldset>

                     <fieldset style={{marginBottom:"10px", border:'1px solid #c4c4c4', borderRadius:'5px'}}>
                <legend>NBFC Bank Details</legend>
                <Controller
                    name="nbfcBankDetails"
                    control={control}
                    rules={{ required: "NBFC Bank Details image is required" }}
                    render={({ field, fieldState: { error } }) => renderFileInput(field, error)}
                />
            </fieldset>

                     <TextField fullWidth label="Gross Weight"
                    type='number'
                        {...register("grossWeight", {
                            required: "Gross Weight is required",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Invalid gross weight"
                            }
                        })}
                        error={!!errors.grossWeight} helperText={errors.grossWeight?.message}  sx={{ mb: 2 }}
                        InputLabelProps={{  shrink: true, }}
                    />

                    <TextField
                        fullWidth
                        label="Net Weight" type='number'
                        {...register("netWeight", {
                            required: "Net Weight is required",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]+$/,
                                message: "Invalid net weight"
                            }
                        })}
                        error={!!errors.netWeight}
                        helperText={errors.netWeight?.message}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ 
                            shrink: true,
                          }}
                    />
                    
                    

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit
                </Button>
            </Box>
        </Box>
        <Loader loading={loading} />
        </SnackbarProvider>
    );
}

export default PledgedForm;
