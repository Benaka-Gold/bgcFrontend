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
import { Box } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { createBranch, updateBranch } from "../../apis/branch";
import Loader from "../Loader";

function BranchDialog({ open, handleClose, branchData, saveBranch }) {
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
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
      res = await updateBranch(branchData._id, formData);
    } else {
      // Create new branch
      res = await createBranch(formData);
    }

    if (res && res.status === 200) {
      alert("Branch Saved Successfully");
      saveBranch && saveBranch(res.data); // If you have a callback to update the list or state
    } else {
      alert(res ? res.error.message : "An error occurred");
    }

    setLoading(false);
    handleClose();
  };

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (branchData) {
      // Populate form with existing data including branchImage
      Object.keys(branchData).forEach((key) => {
        setValue(key, branchData[key]);
      });
      if (branchData.branchImage) {
        // Set image preview if branch image exists
        const file = async () => {
          const file = await getFile(branchData.branchImage);
          if(file.data?.data){
            setImagePreview(file.data.data);
          }
     
        };
        file()
      }
    }
  }, [branchData, setValue]);

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
  React.useEffect(() => {
    if (branchData) {
      reset(branchData);
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

          {/* You can similarly add fields for employees and branchImage, depending on how you want to handle those */}
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
