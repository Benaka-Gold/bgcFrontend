import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, OutlinedInput } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { uploadfiles, deleteFile, getFile } from '../../../../apis/fileUpload';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../../../../apis/customer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Player } from 'video-react';
import "/node_modules/video-react/dist/video-react.css";
import { updateTask } from '../../../../apis/task';
import { SnackbarProvider, enqueueSnackbar, useSnackbar  } from "notistack";
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';
import OtpVerify from './subComponent/otpVerify';
import { customerVerify } from '../../../../apis/customer';
import Loader from '../../../Loader';


const Verification = () => {
  const [customerData, setCustomerData] = useState({});
  const [recording, setRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [useFrontCamera, setUseFrontCamera] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignedTask, setAssignedTask] = useState()
  const [otpVerified, setOtpVerified] = useState(false)
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
  const { enqueueSnackbar } = useSnackbar(); // Add this line

  const getVideoInputDevice = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
  
      if (videoDevices.length > 1) {
        // Assuming the first device is the back camera and the second is the front camera
        // This might need adjustment based on the device
        const desiredCamera = useFrontCamera ? videoDevices.find(d => d.label.toLowerCase().includes('front')) : videoDevices.find(d => d.label.toLowerCase().includes('back'));
        return desiredCamera || videoDevices[0];
      } else {
        // If there's only one camera, return it
        return videoDevices[0];
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})

    }
  };

  useEffect(() => {
    if (recording) {
      stopRecording();
      startRecording();
    }
  }, [useFrontCamera]);

  useEffect(() => {
    fetchInitialData();
  }, [customerId]);

  const fetchInitialData = async () => {
    setLoading(true);
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
      enqueueSnackbar({message : error.message ,variant : 'error'})
    } finally {
      setLoading(false);
    }
  };
  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  
  useEffect(()=>{
    let task =async()=>{
     let response =await fetchAssignedTask(customerId)
     setAssignedTask(response)
    } 
    task()
   },[])
  

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
    if (formData.typesOfVerification.length !== 2) errors.typesOfVerification = 'Verification is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.removeAttribute('src');
      videoRef.current.removeAttribute('srcObject');
      videoRef.current.load();
    }
    setRecording(false);
  };

  const cancelRecording = async () => {
    setLoading(true)
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
      updatedTask.state = {};
    }
    updatedTask.state.isVerification = false;
    console.log(updatedTask);
    const updatedTypesOfVerification = formData.typesOfVerification.filter(type => type !== 'House Verified');
    try{
      if (formData.houseVerification) {
      await deleteFile(formData.houseVerification);
      setFormData({ ...formData, houseVerification: '' ,typesOfVerification :updatedTypesOfVerification});
      const updated = {
        ...formData, houseVerification : null
      }
      const response = await updateCustomer(customerId, updated);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      if (response.status === 200 && taskResponse.status === 200) {
        enqueueSnackbar({message : 'Video Removed' ,variant : 'success'})
        setTimeout(()=>{
          setLoading(false)
        }, 500)
      }
    }
    setMediaBlobUrl(null);
    videoRef.current.style.display = 'none'
  }catch(error){
    enqueueSnackbar({message : error.message ,variant : 'error'})
  }
  };
  
  const startRecording = async () => {
    try {
      const videoDevice = await getVideoInputDevice();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          deviceId: videoDevice.deviceId,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.style.display = 'block';
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
  
      // Stop recording after 30 seconds
      const recordingDuration = 90000; // 30 seconds
      mediaRecorder.onstart = () => {
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            stopRecording();
          }
        }, recordingDuration);
      };
  
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
          enqueueSnackbar({message : error.message ,variant : 'error'})

          setUploadError(true);
        }
      };
      setRecording(true);
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
  };
  // const toggleCamera = () => {
  //   if (recording) {
  //     stopRecording();
  //   }
  //   setUseFrontCamera(!useFrontCamera);
  //   // Optionally, you can start recording immediately after switching the camera
  //   // startRecording();
  // };

  useEffect(() => {
    let newTypes = [...formData.typesOfVerification];
    if (otpVerified && !newTypes.includes('OTP Verified')) {
      newTypes.push('OTP Verified');
    }
    if (mediaBlobUrl && !newTypes.includes('House Verified')) {
      newTypes.push('House Verified');
    }
    setFormData(prevFormData => ({ ...prevFormData, typesOfVerification: newTypes }));
  }, [otpVerified, mediaBlobUrl]);

  const handleOpen =async () => {
    setLoading(true)
    try{
       const response = await customerVerify(customerId)
       if(response.status === 200){
        console.log(response.data);
        enqueueSnackbar({message : "OTP Sent Succesfully" ,variant : 'success'})
       }
    }catch(error){
    enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
      setTimeout(()=>{
        setLoading(false)
        setDialogOpen(true);
      }, 250)
    }
  };
  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (!validateForm()) {
      setLoading(false); 
      return;
    }
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
      updatedTask.state = {};
    }
    updatedTask.state.isVerification = true;
    try {
      const response = await updateCustomer(customerId, formData);
      const taskResponse = await updateTask(updatedTask._id, updatedTask)
      if (response.status === 200 && taskResponse.status === 200) {
        enqueueSnackbar("Form Submitted Successfully!", { variant: "success" });
        setTimeout(()=>{
          navigate(`/executive/customerdetails?filter=${customerId}`);
        }, 250)
      }  
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    } finally {
      setLoading(false); 
    }
  };

  const InfoRow = ({ title, value, isAddress }) => (
    <Box>
        <Box display="flex" flexDirection="column"  width="100%" mb={1} mt={1} mr={2} >
            <Typography sx={{ fontWeight: 'bold', width: '100%' }}>{title}</Typography>
            <Typography sx={{ wordBreak: isAddress ? 'break-word' : 'normal', width: '50%' }}>
                {value}
            </Typography>
        </Box>
    </Box>
);
console.log("formData",formData);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box component="form" onSubmit={onSubmit} sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, display: "flex", flexDirection: "column", height: "auto", p: 3 }}>
      <Box sx={{width: { xs: '100%', sm: '75%', md: '60%', lg: '30%' }, mx: 'auto' }}>
      <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
        <ArrowBackIcon onClick={() => navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt: 2 }} />
        <Typography variant="h5" sx={{ p: 2 }}>
          Verification
        </Typography>
      </Box>

      <FormControl fullWidth  disabled={true}>
        <InputLabel id="typesOfVerification-label">Types of Verification</InputLabel>
        <Select  labelId="typesOfVerification-label"  id="typesOfVerification" multiple
          value={formData.typesOfVerification} onChange={handleSelectChange}
          input={<OutlinedInput label="Types of Verification" />}
          renderValue={(selected) => selected.join(', ')}>
          {['House Verified', 'OTP Verified'].map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset" error={!!formErrors.verificationFeedback}  >
        <FormLabel component="legend" sx={{pt:5}}>Verification Feedback</FormLabel>
        <RadioGroup row name="verificationFeedback" sx={{pb:3}} value={formData.verificationFeedback} onChange={handleInputChange}>
          <FormControlLabel value={true} control={<Radio />} label="Verified" />
          <FormControlLabel value={false} control={<Radio />} label="Not Verified" />
        </RadioGroup>
        {formErrors.verificationFeedback && <Typography color="error">{formErrors.verificationFeedback}</Typography>}
      </FormControl>

      {!mediaBlobUrl && !recording && (
          <Box>
            <Button color="primary" onClick={startRecording}>Start Recording</Button>
            {/* <Button onClick={() => setUseFrontCamera(!useFrontCamera)}> Switch Camera </Button> */}
          </Box>
      )}
      
      
    <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '500px', display: 'none' }} /><br/>
        {mediaBlobUrl && (
          <>
          <InfoRow title={"House Verification Video"} value={
            <Player src={mediaBlobUrl} fluid={false} width={330} height={350} />
          } />
          <IconButton onClick={cancelRecording}>
            <CancelIcon /><br/>
          </IconButton>
          </>
        )}
      {uploadError && <Typography color="error" sx={{ mt: 2 }}>Failed to upload video. Please try again.</Typography>}
      {formErrors.houseVerification && <Typography color="error">{formErrors.houseVerification}</Typography>}
      {recording && (
        <>
        {/* <Button onClick={() => setUseFrontCamera(!useFrontCamera)}>Switch Camera</Button> */}
        <Button variant="contained" color="secondary" onClick={stopRecording}>Stop Recording</Button><br/>
        </>
      )}
      {!formData.typesOfVerification.includes('OTP Verified') && <Typography color="error">{formErrors.typesOfVerification}</Typography>}
      <Button  disabled={formData.typesOfVerification.includes('OTP Verified') || otpVerified} onClick={handleOpen}>  OTP Verify</Button>
      <OtpVerify open={dialogOpen} setDialogOpen={setDialogOpen} phoneNumber={customerData.phoneNumber} setOtpVerified={setOtpVerified} setLoading={setLoading} />
      
      </Box>
      {console.log(formData)}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Submit</Button>
      <Loader loading={loading} />
    </Box>
    </SnackbarProvider>
  );
};

export default Verification;