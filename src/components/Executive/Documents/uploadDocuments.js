import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, IconButton, Avatar, InputAdornment, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { uploadfiles } from '../../../apis/fileUpload';
import { updateCustomer, getCustomerById } from '../../../apis/customer';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add'; // Import the add icon
import { deleteFile, getFile } from '../../../apis/fileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function VerificationDocuments() {
  const [imagePreviews, setImagePreviews] = useState({});
  const [customerData, setCustomerData] = useState([])
  let location = useLocation();
  let navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  let customerId = query.get('filter');


  const { control, handleSubmit, setValue,getValues, formState: { errors } } = useForm({
    defaultValues: {
      panDetails: { number: '', file: '' },
      idProof: { number: '', file: '', idType: '' },
      addressProof: { number: '', file: '', idType: '' },
      agreementOfPurchase: '',
      offerLetterOwnershipDeclaration: '',
      noc: '',
      authorizationLetter: ''
    }
  });
  const getAssignedLeads = async () => {
    try {
      let res = await getCustomerById(customerId);
      setCustomerData(res.data)
      if (res.data) {
        const updates = {}; 
        const newImagePreviews = {}; 
  
        for (const key in res.data) {
          if (res.data[key] && typeof res.data[key] === 'object') {
            for (const subKey in res.data[key]) {
              const value = res?.data[key][subKey];
              if (subKey === 'file' && value) {
                const fileResponse = await getFile(value);
                if (fileResponse && fileResponse.data) {
                  newImagePreviews[`${key}.${subKey}`] = fileResponse.data.data;
                  updates[`${key}.${subKey}`] = value;
                }
              } else {
                updates[`${key}.${subKey}`] = value;
              }
            }
          } else {
            if (['agreementOfPurchase', 'offerLetterOwnershipDeclaration', 'noc', 'authorizationLetter'].includes(key) && res.data[key]) {
              const fileResponse = await getFile(res.data[key]);
              if (fileResponse && fileResponse.data) {
                newImagePreviews[key] = fileResponse.data.data;
                updates[key] = res.data[key];
              }
            } else {
              updates[key] = res.data[key];
            }
          }
        }
        Object.entries(updates).forEach(([key, value]) => setValue(key, value));
        setImagePreviews(newImagePreviews);
      }
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
    }
  };
  

  useEffect(() => {
    getAssignedLeads();
  }, [customerId]);

   const {name} = customerData
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await uploadfiles(file, "customer", name && name);
        if (res.success) {
          setValue(fieldName, res.data._id, { shouldValidate: true });
          setImagePreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
          return res.data._id;
        } else {
          throw new Error(res.error || 'File upload failed');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateImagePreview = async (fieldName) => {
    const fileId = getValues(fieldName);
    if (fileId) {
      const isSuccess = await deleteFile(fileId);
      if (isSuccess) {
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[fieldName];
          return newPreviews;
        });
        setValue(fieldName, ''); 
      }
    }
  };

  const onSubmit = async (data) => {
    const response = await updateCustomer(customerId, data);
    if (response.status) {
      const status = JSON.parse(localStorage.getItem('status')) || {};
      status.isDocumentsUpload = true;
      localStorage.setItem('status', JSON.stringify(status));
      alert('Form Submitted Successfully');
      navigate(`/executive/customerdetails?filter=${customerId}`);
    } else {
      alert('Something went wrong... Please try again');
    }
  };

  const renderFileInput = (field, error, label) => {
    const fileUploaded = imagePreviews[field.name]; // This contains the image URL if uploaded
  
    return (
      <Box sx={{ mb: 2, textAlign: 'center' }}>

        <Box component="label" htmlFor={field.name}>{label}</Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          {fileUploaded ? (
            <>
              <Box component="img" src={fileUploaded} alt="Preview"  sx={{ width: 100,  height: 100, objectFit: 'cover',  border: '1px solid #ddd', borderRadius: '4px', }} />
              <IconButton onClick={() => updateImagePreview(field.name)} sx={{ ml: 1 }}>
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <input id={field.name} type="file"
                onChange={(e) => {
                  handleFileUpload(e, field.name)
                  field.onChange(e.target.files) }}
                style={{ display: 'none' }}  ref={field.ref} />
              <label htmlFor={field.name}>
                <Button variant="contained" color="primary" component="span" startIcon={<AddIcon />}>
                  Upload
                </Button>
              </label>
            </>
          )}
        </Box>
        {error && <Box color="error.main" sx={{ mt: 1 }}>{error.message}</Box>}
      </Box>
    );
  };
  
  

  return (
    <Box sx={{width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" }, height:"auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },}}>
      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
        <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
        <Typography variant="h5" sx={{ p: 2 }}>
          Documents
        </Typography>
      </Box>
      <Box sx={{ height:"auto", display:"flex",alignContent:"center", justifyContent:"center",}}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ margin: 2 }}>
        {/* PAN File Upload */}
        <Controller name="panDetails.number"  control={control}  rules={{ required: "PAN number is required" }}
          render={({ field }) => (
            <TextField {...field} label="PAN Number" variant="outlined" margin="normal" fullWidth
              error={!!errors.panDetails?.number}
              helperText={errors.panDetails?.number?.message}
            />
          )}
        />
         <Controller name="panDetails.file" control={control} rules={{ required: "PAN file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'PAN')
          }
        />

        {/* ID Proof File Upload */}
        <Controller name="idProof.number" control={control} rules={{ required: "ID number is required" }}
          render={({ field }) => (
            <TextField {...field} label="ID Number" variant="outlined" margin="normal" fullWidth
              error={!!errors.idProof?.number}
              helperText={errors.idProof?.number?.message}
            />
          )}
        />
        <Controller  name="idProof.idType" control={control} rules={{ required: "ID type is required" }}
          render={({ field }) => (
            <TextField {...field} label="ID Type" variant="outlined" margin="normal" fullWidth
              error={!!errors.idProof?.idType}
              helperText={errors.idProof?.idType?.message}
            />
          )}
        />
       <Controller name="idProof.file" control={control} rules={{ required: "ID proof file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'ID Proof')
          }
        />

          <Controller  name="addressProof.number" control={control} rules={{ required: "Address number is required" }}
          render={({ field }) => (
            <TextField {...field} label="Address Number" variant="outlined" margin="normal" fullWidth
              error={!!errors.addressProof?.number}
              helperText={errors.addressProof?.number?.message}
            />
          )}
        />
         <Controller name="addressProof.idType" control={control}  rules={{ required: "Address type is required" }}
          render={({ field }) => (
            <TextField {...field} label="Address Type" variant="outlined" margin="normal" fullWidth
              error={!!errors.addressProof?.idType}
              helperText={errors.addressProof?.idType?.message}
            />
          )}
        />
        {/* Address Proof File Upload */}
        <Controller  name="addressProof.file" control={control} rules={{ required: "Address proof file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'Address Proof')
          }
        />

        {/* Agreement of Purchase File Upload */}
        <Controller  name="agreementOfPurchase"  control={control} rules={{ required: "Agreement of purchase file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'Agreement of Purchase')
          }
        />

      {/* Offer Letter Ownership Declaration File Upload */}
      <Controller  name="offerLetterOwnershipDeclaration"  control={control} rules={{ required: "Offer letter file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'Offer Letter Ownership Declaration')
          }
        />

        {/* NOC File Upload */}
        <Controller name="noc" control={control}  rules={{ required: "NOC file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'NOC')
          }
        />

        {/* Authorization Letter File Upload */}
        <Controller name="authorizationLetter"  control={control}  rules={{ required: "Authorization letter file is required" }}
          render={({ field, fieldState: { error } }) => 
            renderFileInput(field, error, 'Authorization Letter')
          }
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
          Submit
        </Button>
      </Box>
    </form>
    </Box>
    </Box>
  );
}

export default VerificationDocuments;
