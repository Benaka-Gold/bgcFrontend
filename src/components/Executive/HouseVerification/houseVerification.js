import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, OutlinedInput } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { uploadfiles, deleteFile, getFile } from '../../../apis/fileUpload';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../Loader';
import { getCustomerById, updateCustomer } from '../../../apis/customer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Verification = () => {
  const [customerData, setCustomerData] = useState({});
  const [recording, setRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [useFrontCamera, setUseFrontCamera] = useState(true); // true for front camera, false for back camera



  const [formData, setFormData] = useState({
    houseVerification: '',
    verificationFeedback: '',
    typesOfVerification: []
  });
  
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');

  const getVideoInputDevice = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 1) {
        // If there are multiple cameras, decide which one to use
        return useFrontCamera ? videoDevices[1] : videoDevices[0]; // This assumes the second device is the front camera
      } else {
        // If there's only one camera, return it
        return videoDevices[0];
      }
    } catch (error) {
      console.error('Error fetching video input devices:', error);
    }
  };

  useEffect(() => {
    if (recording) {
      // Stop the current recording
      stopRecording();
      // Start a new recording with the new camera
      startRecording();
    }
  }, [useFrontCamera]);

  useEffect(() => {
    setLoading(true);
    const fetchInitialData = async () => {
      try {
        const res = await getCustomerById(customerId);
       
        if (res.data) {
          setCustomerData(res.data);

          const fileRes = res.data.houseVerification ? await getFile(res.data.houseVerification) : null;
          

          setFormData({
            houseVerification: res.data.houseVerification || '',
            verificationFeedback: res.data.verificationFeedback || '',
            typesOfVerification: res.data.typesOfVerification || []
          });
          setMediaBlobUrl(fileRes ? fileRes.data.data : null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [customerId]);
  

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSelectChange = (event) => {
    setFormData({ ...formData, typesOfVerification: event.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.houseVerification) errors.houseVerification = 'Video is required';
    if (!formData.verificationFeedback) errors.verificationFeedback = 'Please select a feedback option';
    if (formData.typesOfVerification.length === 0) errors.typesOfVerification = 'Please select at least one type of verification';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startRecording = async () => {
    try {
      const videoDevice = await getVideoInputDevice();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { deviceId: videoDevice.deviceId } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.style.display = 'block';
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      mediaRecorder.ondataavailable = async (event) => {
        try {
          const blob = await event.data;
          const file = new File([blob], "video.mp4", { type: "video/mp4" });
          const uploadResponse = await uploadfiles(file, "customer", `${customerData.name}/verification`);
          setFormData({ ...formData, houseVerification: uploadResponse.data._id });
          setMediaBlobUrl(URL.createObjectURL(blob));
          setUploadError(false);
          setRecording(false);
          videoRef.current.style.display = 'none';
        } catch (error) {
          console.error("Error uploading the video: ", error);
          setUploadError(true);
        }
      };
      setRecording(true);
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      alert(error)
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const cancelRecording = async () => {
    if (formData.houseVerification) {
      await deleteFile(formData.houseVerification);
      setFormData({ ...formData, houseVerification: '' });
      const updated = {
        ...formData, houseVerification : null
      }
      console.log(updated);
      const response = await updateCustomer(customerId, updated);
      console.log(response);
    }
    setMediaBlobUrl(null);
    videoRef.current.style.display = 'none';
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await updateCustomer(customerId, formData);
      
      if (response.status === 200) {
        alert('Form Submitted Successfully');
        navigate(`/executive/customerdetails?filter=${customerId}`);
        const status = JSON.parse(localStorage.getItem('status')) || {};
        status.isVerification = true;
        localStorage.setItem('status', JSON.stringify(status));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };





  return (
    <Box component="form" onSubmit={onSubmit} sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, display: "flex", flexDirection: "column", height: "92vh", p: 3, backgroundColor: "#f7f7f8" }}>
      {loading && <Loader />}

      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
        <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
        <Typography variant="h5" sx={{ p: 2 }}>
          Verification
        </Typography>
      </Box>

      <FormControl fullWidth error={!!formErrors.typesOfVerification}>
        <InputLabel id="typesOfVerification-label">Types of Verification</InputLabel>
        <Select
          labelId="typesOfVerification-label"
          id="typesOfVerification"
          multiple
          value={formData.typesOfVerification}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Types of Verification" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {['House Verification', 'OTP Verification', 'Alter OTP'].map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {formErrors.typesOfVerification && <Typography color="error">{formErrors.typesOfVerification}</Typography>}
      </FormControl>

      <FormControl component="fieldset" error={!!formErrors.verificationFeedback}>
        <FormLabel component="legend">Verification Feedback</FormLabel>
        <RadioGroup row name="verificationFeedback" value={formData.verificationFeedback} onChange={handleInputChange}>
          <FormControlLabel value={true} control={<Radio />} label="Verified" />
          <FormControlLabel value={false} control={<Radio />} label="Not Verified" />
        </RadioGroup>
        {formErrors.verificationFeedback && <Typography color="error">{formErrors.verificationFeedback}</Typography>}
      </FormControl>

      {!mediaBlobUrl && !recording && (
        <Button color="primary" onClick={startRecording}>Start Recording</Button>
      )}
      {recording && (
        <Button variant="contained" color="secondary" onClick={stopRecording}>Stop Recording</Button>
      )}
      <Button onClick={() => setUseFrontCamera(!useFrontCamera)}>
      Switch Camera
    </Button>
      <video ref={videoRef} autoPlay style={{ width : 500, height: 'auto', display: 'none' }} />
      {mediaBlobUrl && (
        <>
          <video src={mediaBlobUrl} controls autoPlay style={{ width : 500, height: 'auto' }} />
          <IconButton onClick={cancelRecording}>
            <CancelIcon />
          </IconButton>
        </>
      )}
      {uploadError && <Typography color="error" sx={{ mt: 2 }}>Failed to upload video. Please try again.</Typography>}
      {formErrors.houseVerification && <Typography color="error">{formErrors.houseVerification}</Typography>}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
    </Box>
  );
};

export default Verification;