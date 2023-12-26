import React, { useEffect, useState } from 'react';
import { Box, Typography,Button, Card, CardContent,CardMedia,IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getOrnamentsList, deleteOrnament } from '../../../apis/ornaments';
import { getOrnamentsList, deleteOrnament } from '../../../../apis/ornaments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import Loader from '../../Loader';
import Loader from '../../../Loader';
// import { getFile } from '../../../apis/fileUpload';
// import { getFile } from '../../../../apis/fileUpload';
import { getFile } from '../../../../apis/fileUpload';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
// import { updateTask } from '../../../apis/task';
import { updateTask } from '../../../../apis/task';
// import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';
import { fetchAssignedTask } from '../CustomerBasic/subComponent/CustomerVerification';
// import { updateBusiness } from '../../../apis/business';
import { updateBusiness } from '../../../../apis/business';

function OrnamentList() {
  const [ornamentData, setOrnamentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignedTask, setAssignedTask] = useState([])
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');


  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
  const Ornaments = async (customerId, businessIds) => {
    const updatedTask = { ...Task };
    if (!updatedTask.state) {
    updatedTask.state = {};
     }
    updatedTask.state.isOrnamentDetails = false;
    try{
      const ornamentResponse = await getOrnamentsList(customerId, businessIds)
      if (ornamentResponse.status === 200) {
        setLoading(true);
        
        const updatedOrnaments = await Promise.all(ornamentResponse.data.map(async (item) => {
          const imageUrl1 = await getFile(item.image);
          const image = imageUrl1?.data?.data;
          return { ...item, image };
        }));
        setTimeout(() => {
          setOrnamentData(updatedOrnaments);
          setLoading(false);
        }, 250);
        if(updatedOrnaments.length <= 0){
          if (!Task || !Task._id) {
            return;
          }
          try{
          const taskResponse = await updateTask(updatedTask._id && updatedTask._id, updatedTask && updatedTask)
          }catch(error){
            enqueueSnackbar({message : error.message ,variant : 'error'})
          }
        }
      }
    }catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
  };
 
  let gettask =async()=>{
    let response =await fetchAssignedTask(customerId)
    setAssignedTask(response)
    const businessIds = response.map(item => item.businessId);
    Ornaments(customerId, businessIds[0])
   }
   const grossWeightAmount = async () => {
    if (ornamentData.length === 0) {
      return;
    }
    const businessId = ornamentData[0].businessId;
    if (!businessId) {
      return;
    }
    const totalAmount = ornamentData.reduce((total, item) => total + item.amount, 0);
    const payload = {
      grossAmount: totalAmount
    };
    try {
      const response = await updateBusiness(businessId, payload);
      console.log(response.data);
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  };
  useEffect(() => {
    grossWeightAmount();
  }, [ornamentData]);
  

   useEffect(()=>{
    gettask()
   },[])
  const handleDelete = async (id) => {
    setLoading(true);
    try{
      const response = await deleteOrnament(id);
    if (response.status === 200 ) {
      setTimeout(() => {
        enqueueSnackbar({message : 'Ornament Deleted' ,variant : 'success'})
        gettask();
        setLoading(false);
      }, 250);
    }}catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
  };
  const totalItems = ornamentData.length;
  const totalNetWeight = ornamentData.reduce((total, item) => total + item.netWeight, 0);
  const totalAmount = ornamentData.reduce((total, item) => total + item.amount, 0);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
    width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" },}}>
     <Box sx={{display:"flex", height:"auto", width:"auto", justifyContent:"center"}}>
     <ArrowBackIcon onClick={()=> navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt:2 }} />
      <Typography variant="h5" sx={{ p: 2,fontFamily: "Poppins, sans-serif" }}> Ornament List</Typography>
      </Box>
      <>
      <Box sx={{ width:{md:"70%", sm:"70%", xs:"100%", lg:"30%"},margin:"auto", height:"auto"  }} >
        {ornamentData.map((item) => (
          <Card key={item.id} sx={{ display: 'flex', mb: 2, alignItems: 'center', height: 150 }}>
            <CardMedia component="img" sx={{ width: 150, height: '100%', objectFit: 'cover', border:"1px solid #eaeaea" }}
              image={item?.image} alt={item.name} />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', }}>
              <CardContent >
                <Typography component="div" variant="h6" sx={{fontFamily: "Poppins, sans-serif"}}>
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{fontFamily: "Poppins, sans-serif"}}>
                  Net Weight: {item.netWeight} g
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{fontFamily: "Poppins, sans-serif"}}>
                  Amount:  {new Intl.NumberFormat('en-IN').format(item.amount)}
                </Typography>
                
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton aria-label="delete" sx={{ color: "red" }} onClick={() => handleDelete(item._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate(`/executive/ornamentuploads?filter=${customerId}`)} sx={{ mt: 2,fontFamily: "Poppins, sans-serif" }}>
          Add Ornament
        </Button>
      </Box>
      
      {totalItems !==0 &&
      <Box sx={{ display: 'flex',flexDirection:'column', justifyContent: 'space-evenly', p: 2}}>
        <Typography variant="body1" sx={{fontFamily: "Poppins, sans-serif"}}>Total Items: {totalItems}</Typography>
        <Typography variant="body1" sx={{fontFamily: "Poppins, sans-serif"}}>Total Net Weight: {Number(totalNetWeight.toFixed(2))} g</Typography>
        <Typography variant="body1" sx={{fontFamily: "Poppins, sans-serif"}}>Total Amount: {new Intl.NumberFormat('en-IN').format(totalAmount)} </Typography>
      </Box>
      }
      </> 
      <Loader loading={loading} />
    </Box>
    </SnackbarProvider>
  );
}

export default OrnamentList;
