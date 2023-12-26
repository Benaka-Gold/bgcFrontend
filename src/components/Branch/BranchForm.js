import React, { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDropzone } from "react-dropzone";
import { uploadfiles, deleteFile, getFile } from "../../apis/fileUpload";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { createBranch, updateBranch } from "../../apis/branch";
import Loader from "../Loader";
import {getAllDivision} from '../../apis/divisions'
import { enqueueSnackbar } from "notistack";

function BranchDialog({ open,handleClose, branchData, saveBranch }) {
  const [loading, setLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [divisions,setDivisions] = React.useState([])
  
  const { control, reset, setValue, getValues, formState: { errors }, } = useForm({
    defaultValues: {
      branchName: "",
      branchImage: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = getValues();
    let res;
    
    if (branchData && branchData._id) {
      // Update branch
      try{
        res = await updateBranch(branchData._id, formData);
        enqueueSnackbar({message : "Branch Updated Successfully",variant : "success"})
      }
      catch(error) {enqueueSnackbar({message : error.response.data.message,variant : 'error'})}
    } else {
      // Create new branch
      try{
        res = await createBranch(formData);
        enqueueSnackbar({message : "Branch Created Successfully",variant : "success"})
      }
      catch(error) {
        enqueueSnackbar({message : error.response.data.message,variant : 'error'})}
    }

    setLoading(false);
    handleClose()
  };


  useEffect(() => {
    if (branchData) {
      Object.keys(branchData).forEach((key) => {
        setValue(key, branchData[key]);
      });
      if (branchData.branchImage) {
        file()
      }
    }
  }, [branchData, setValue]);

  useEffect(()=>{
    fetchDivisions()
  },[])

  const fetchDivisions = async() => {
    try {
      const res = await getAllDivision()
      setDivisions(res.data)
    } catch(error) {
      enqueueSnackbar({message : error.message,variant : 'error'})
    }
  }
  const file = async () => {
    try {
      const file = await getFile(branchData.branchImage);
      if(file.data?.data){
        setImagePreview(file.data.data);
      } 
    } catch(error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error'})}
    }


  const onDrop = useCallback(
    async (acceptedFiles) => {
      const existingImageId = getValues("branchImage");
      if (existingImageId) {
        await deleteFile(existingImageId);
      }

      const file = acceptedFiles[0];
      const response = await uploadfiles(file);

      if (response.data._id) {
        setValue("branchImage", response.data._id);
        setImagePreview(URL.createObjectURL(file));
      }
      // Handle errors here if upload failed
    },
    [getValues, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    multiple: false,
  });

  const handleDeleteImage = async () => {
    const imageId = getValues("branchImage");
    if (imageId) {
      await deleteFile(imageId);
      setValue("branchImage", "");
      setImagePreview("");
    }
  };

  useEffect(() => {
    if (branchData) {
      reset(branchData); // Populate form with branch data for editing
    } else {
      reset({
        branchName: "",
        location: "",
        goldStock: 0, // Assuming a default value of 0 for numeric fields
        goldMovementThreshold: 0,
        divisionId: "",
        branchImage: "", // Or null if you prefer
        // ... include other fields as necessary with their default empty/null values ...
      });
    }
  }, [branchData, reset]);


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{branchData ? "Update" : "Create"} Branch</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Branch Name */}
          <Controller
            name="branchName"
            control={control}
            defaultValue=""
            rules={{ required: "Branch name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Branch Name"
                error={!!errors.branchName}
                helperText={errors.branchName ? errors.branchName.message : ""}
                fullWidth
                margin="dense"
              />
            )}
          />

          {/* Location */}
          <Controller
            name="location"
            control={control}
            defaultValue=""
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Location"
                error={!!errors.location}
                helperText={errors.location ? errors.location.message : ""}
                fullWidth
                margin="dense"
              />
            )}
          />

          {/* Branch Manager (Assuming a dropdown selection for branch managers) */}
          {/* Note: You need to populate branchManagerOptions with actual data */}
          {/* <Controller
            name="branchManager"
            control={control}
            defaultValue=""
            rules={{ required: 'Branch manager is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Branch Manager"
                error={!!errors.branchManager}
                helperText={errors.branchManager ? errors.branchManager.message : ''}
                fullWidth
                margin="dense"
              >
                {branchManagerOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          /> */}

          {/* Gold Stock */}
          <Controller
            name="goldStock"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <TextField
                {...field}
                label="Gold Stock"
                type="number"
                fullWidth
                margin="dense"
              />
            )}
          />

          {/* Gold Movement Threshold */}
          <Controller
            name="goldMovementThreshold"
            control={control}
            defaultValue={0}
            rules={{ required: "Gold movement threshold is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Gold Movement Threshold"
                type="number"
                error={!!errors.goldMovementThreshold}
                helperText={
                  errors.goldMovementThreshold
                    ? errors.goldMovementThreshold.message
                    : ""
                }
                fullWidth
                margin="dense"
              />
            )}
          />

          <FormControl fullWidth sx={{mt : 1,mb :1}}>
          <InputLabel id="division-label">Division</InputLabel>
          <Controller 
            name="division"
            control={control}
            defaultValue={0}
            rules={{ required: "Division is required" }}
            render={({ field }) => (
              <Select 
              {...field} 
              fullWidth
              defaultValue={''}
              error={!!errors.divisionId}
              helperText={
                  errors.divisionId
                    ? errors.divisionId.message
                    : ""
              }
              labelId="division-label"
              label="Division"
              margin="dense"

              >
                {divisions.map((division)=><MenuItem value={division._id} key={division._id}>{division.divisionName}</MenuItem>)}
              </Select>
              )}
            />
          </FormControl>
         

          <Box
            {...getRootProps()}
            sx={{
              border: "1px dashed grey",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <Box>
                <img
                  src={imagePreview}
                  alt="Branch"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
                <Button
                  startIcon={<DeleteOutline />}
                  onClick={handleDeleteImage}
                >
                  Delete
                </Button>
              </Box>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
      <Loader loading={loading} />
    </Dialog>
  );
}

export default BranchDialog;