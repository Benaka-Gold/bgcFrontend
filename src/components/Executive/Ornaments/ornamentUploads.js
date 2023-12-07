import React , {useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Typography, Button, Checkbox, FormControlLabel } from '@mui/material';
import { uploadfiles } from '../../../apis/fileUpload';
import { useNavigate, useLocation } from 'react-router-dom';
// import { ornamentCreation } from '../../../apis/customer';
import { createOrnament } from '../../../apis/ornaments';
import { getCustomerById } from '../../../apis/customer';
import Loader from '../../Loader';

function OrnamentUploads() {
  const [customerData, setCustomerData] = useState([])
  const [loading, setLoading] = useState(false)
  let location = useLocation()
  let navigate =useNavigate()
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      customerId:customerId,
      name: "",
      grossWeight: 0,
      netWeight: 0,
      billAvailable: false,
      image: null,
      billImage: null
    }
  });

  const getAssignedLeads = async ()=>{
    let res = await getCustomerById(customerId)
    if (res.data) {
      setLoading(true)
      setTimeout(()=>{
        setCustomerData(res.data)
        setLoading(false)
      }, 250)
    }
  }
  useEffect(()=>{
    getAssignedLeads()
  },[])

  const billAvailable = watch("billAvailable");
  const onSubmit =async (data) => {
    const response = await createOrnament(data)
    console.log(response);
    if(response.status === 200){
      setLoading(true)
      console.log(response);
      setTimeout(()=>{
        setLoading(false)
        alert("Ornament Uploaded Successfully")
        const status = JSON.parse(localStorage.getItem('status')) || {};
        status.isOrnamentDetails = true;
        localStorage.setItem('status', JSON.stringify(status));
        return navigate(`/executive/ornamentlist?filter=${customerId}`)
      })
    }
  };
   const {name} = customerData
  const handleFileUpload = async (file, fieldName) => {
    try {
      const response = await uploadfiles(file, "customer", `${name}/ornament` );
      if (response.success) {
        setLoading(true)
        setTimeout(()=>{
          setLoading(false)
          setValue(fieldName, response.data._id); 
        })
      } else {
        alert('File upload failed, please try again.');
      }
    } catch (error) {
      console.error(`Error uploading file for ${fieldName}: `, error);
      alert('An error occurred while uploading, please try again.');
    }
  };

  return (
    <Box sx={{width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height:"90vh", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },}}>
    <form onSubmit={handleSubmit(onSubmit)} style={{margin:"20px"}} >
      <Box sx={{ width:{md:"60%", sm:"60%", sx:"100%", lg:"30%"}, height: "auto", margin:"auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Ornament Details</Typography>
        <TextField  fullWidth label="Name"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ mb: 2 }}
        />
        <TextField fullWidth  label="Gross Weight" type={"number"}
          inputMode={'numeric'}
          {...register("grossWeight", { required: "Gross Weight is required", valueAsNumber: true }, )}
          error={!!errors.grossWeight}
          helperText={errors.grossWeight?.message}
          sx={{ mb: 2 }} />

        <TextField  fullWidth label="Net Weight" type='number'
          {...register("netWeight", { required: "Net Weight is required", valueAsNumber: true })}
          error={!!errors.netWeight}
          helperText={errors.netWeight?.message}
          sx={{ mb: 2 }} />

        <FormControlLabel
          control={<Checkbox {...register("billAvailable")}/> }
          label="Bill Available"
          sx={{ mb: 2 }} />
          
        <Controller name="image"  control={control}
          rules={{ required: "Ornament image is required" }}
          render={({ field }) => (
            <TextField  fullWidth type="file" label="Ornament Image"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleFileUpload(file, 'image');
                }
              }}
              error={!!errors.image}
              helperText={errors.image?.message}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          )}
        />
        {billAvailable && (
          <Controller name="billImage"  control={control}
            rules={{ required: billAvailable && "Bill image is required" }}
            render={({ field }) => (
              <TextField fullWidth  type="file"  label="Bill Image"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file, 'billImage');
                  }}}
                error={!!errors.billImage}
                helperText={errors.billImage?.message}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            )}
          />
        )}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
      </Box>
      <Loader loading={loading} />
    </form>
    </Box>
  );
}

export default OrnamentUploads;
