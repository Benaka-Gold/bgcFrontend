import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Typography, Button, Checkbox, FormControlLabel, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { uploadfiles } from '../../../../apis/fileUpload';
import { useNavigate, useLocation } from 'react-router-dom';
import {createOrnament} from '../../../../apis/ornaments'
import { getCustomerById } from '../../../../apis/customer';
import {getGoldRate } from '../../../../apis/goldRate';
import { updateTask } from '../../../../apis/task';
import Loader from '../../../Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';


function OrnamentUploads() {
  const [customerData, setCustomerData] = useState([])
  const [goldRates, setGoldRates] = useState([])
  const [assignedTask, setAssignedTask] = useState()
  const [loading, setLoading] = useState(false)
  let location = useLocation()
  let navigate = useNavigate()
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');
  const { register, control, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm({
    defaultValues: {
      customerId: customerId,
      name: "",
      grossWeight: null,
      netWeight: null,
      billAvailable: false,
      image: null,
      purity: '',
      amount: 0,
      billImage: null,
    }
  });

  const getAssignedLeads = async () => {
    let res = await getCustomerById(customerId)
    if (res.data) {
        setLoading(true)
        setTimeout(() => {
            setCustomerData(res.data)
            setLoading(false)
            const fetchedBusinessId = res?.data?.businessId[0];
            setValue("businessId", fetchedBusinessId);
        }, 250)
    }
}
  const purity = watch("purity");
  const netWeight = watch("netWeight");
  const calculateAmount = () => {
    const selectedRate = goldRates.find(rate => rate._id === purity);
    if (selectedRate && netWeight > 0) {
      const amount = netWeight * selectedRate.price;
      setValue('amount', Math.trunc(amount));
    }
  };

  useEffect(() => {
    calculateAmount();
  }, [purity, netWeight, goldRates]);

  useEffect(() => {
    getAssignedLeads()
  }, [])

  const getGoldRates = async () => {
    try {
      const response = await getGoldRate()
      if (response.status === 200) {
        setGoldRates(response.data)
      }
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' })
    }
  }
  useEffect(() => {
    getGoldRates()
  }, [])

  useEffect(()=>{
    let task =async()=>{
     let response =await fetchAssignedTask(customerId)
     setAssignedTask(response)
    } 
    task()
   },[])
  const billAvailable = watch("billAvailable");
  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const onSubmit = async(data) => {
    setLoading(true)
    try{
      const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isOrnamentDetails = true;
    const response = await createOrnament(data)
    const taskResponse = await updateTask(updatedTask._id, updatedTask)
    if (response.status === 200 && taskResponse.status === 200) {
      setTimeout(() => {
        setLoading(false)
        enqueueSnackbar({message : 'Form Submmitted' ,variant : 'success'})
      })
    }}catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
       setTimeout(()=>{
        setLoading(false)
        return navigate(`/executive/ornamentlist?filter=${customerId}`)
       }, 500)
    }
  };
  const { name } = customerData
  const handleFileUpload = async (file, fieldName) => {
    try {
      const response = await uploadfiles(file, "customer", `${name}/ornament`);
      if (response.success) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setValue(fieldName, response.data._id);
          enqueueSnackbar({message : 'Ornament Image Uploaded' ,variant : 'success'})
        }, 250)
      } 
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
      setTimeout(()=>{
        setLoading(false)
      },350)
    }
  };

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box sx={{ width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height: "90vh", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "10px" }} >
        <Box sx={{ width: { md: "60%", sm: "60%", sx: "80%", lg: "30%" }, height: "auto", margin: "auto" }}>
        <Box sx={{backgroundColor:'white'}}>
          <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
            <ArrowBackIcon onClick={() => navigate(`/executive/ornamentlist?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
            <Typography variant="h5" sx={{ p: 2 }}> Ornament Details</Typography>
          </Box>
         
          <TextField  label="Name" {...register("name", { required: "Name is required" })}
            error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 1, width:'90%' }} />

          <FormControl fullWidth sx={{ mt: 1, mb: 1.5, width:'90%' }} error={!!errors.purity}>
            <InputLabel id="purity-label">Purity</InputLabel>
            <Controller name="purity" control={control} rules={{ required: "Purity is required" }}
              render={({ field }) => (
                <Select labelId="purity-label" id="purity-select" label="Purity"  {...field} >
                  {goldRates && goldRates.map((item) => {
                    return <MenuItem value={item._id}>{item.purityName}</MenuItem>
                  })}
                </Select>
              )} />
            {errors.purity && <Typography color="error">{errors.purity.message}</Typography>}
          </FormControl>


          <TextField fullWidth label="Gross Weight" type="number" name='grossWeight' sx={{ width:'90%' }}
          inputProps={{step : 0.01}}
            {...register("grossWeight", {
              required: "Gross Weight is required", valueAsNumber: true,
            })}
            error={!!errors.grossWeight} helperText={errors.grossWeight?.message} />

          <TextField fullWidth label="Net Weight" type="number" sx={{ mt: 1.5 , width:'90%' }} name='netWeight'
            inputProps={{step : 0.01}}
            {...register("netWeight", {
              required: "Net Weight is required",
            })}
            error={!!errors.netWeight} helperText={errors.netWeight?.message} />



          <FormControlLabel
            control={<Checkbox {...register("billAvailable")} />}
            label="Bill Available"
            sx={{ mb: 2 }} />

          <Controller name="image" control={control}
            rules={{ required: "Ornament image is required" }}
            render={({ field }) => (
              <TextField fullWidth type="file" label="Ornament Image" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file, 'image');
                  }
                }}
                error={!!errors.image} helperText={errors.image?.message}
                InputLabelProps={{ shrink: true }} sx={{ mb: 2, width:'90%'  }} />)} />

          {billAvailable && (
            <Controller name="billImage" control={control}
              rules={{ required: billAvailable && "Bill image is required" }}
              render={({ field }) => (
                <TextField fullWidth type="file" label="Bill Image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(file, 'billImage');
                    }
                  }}
                  error={!!errors.billImage} helperText={errors.billImage?.message}
                  InputLabelProps={{ shrink: true }} sx={{ mb: 2, width:'90%'  }}
                />)} />
          )}
          <TextField {...register("amount")} fullWidth disabled={true} label='Amount' sx={{width:'90%'}} />
          <Button type="submit" variant="contained" sx={{ mt: 2, width:'90%', mb:2 }}  >Submit</Button>
          </Box>
        </Box>
        <Loader loading={loading} />
      </form>
      
    </Box>
    </SnackbarProvider>
  );
}

export default OrnamentUploads;
