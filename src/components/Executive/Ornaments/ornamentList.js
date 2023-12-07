import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrnamentsList, deleteOrnament } from '../../../apis/ornaments';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loader from '../../Loader';
import { getFile } from '../../../apis/fileUpload';

function OrnamentList() {
  const [ornamentData, setOrnamentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');

  const ornamentList = async () => {
    const res = await getOrnamentsList(customerId);
    if (res.status === 200) {
      setLoading(true);
      const updatedOrnaments = await Promise.all(res.data.map(async (item) => {
        const imageUrl1 = await getFile(item.image);
        const image = imageUrl1?.data?.data;
        return { ...item, image };
      }));
      setTimeout(() => {
        setOrnamentData(updatedOrnaments);
        setLoading(false);
      }, 250);
    }
  };

  useEffect(() => {
    ornamentList();
  }, [customerId]);

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await deleteOrnament(id);
    if (response.status === 200) {
      setTimeout(() => {
        alert('Delete Successfully');
        ornamentList();
        setLoading(false);
      }, 250);
    }
  };

  const totalItems = ornamentData.length;
  const totalNetWeight = ornamentData.reduce((total, item) => total + item.netWeight, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh', p: 2, ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
    width:{ md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" },
    }}>
     <Box sx={{display:"flex", height:"auto", width:"auto", justifyContent:"center"}}>
     <ArrowBackIcon onClick={()=> navigate(`/executive/customerdetails?filter=${customerId}`)} sx={{ fontSize: 30, mt:2 }} />
      <Typography variant="h5" sx={{ p: 2 }}>
          Ornament List
      </Typography>
      </Box>
      <Box sx={{ width:{md:"70%", sm:"70%", xs:"100%", lg:"30%"},margin:"auto", height:"auto"  }} >
        {ornamentData.map((item) => (
          <Card key={item.id} sx={{ display: 'flex', mb: 2, alignItems: 'center', height: 120 }}>
            <CardMedia
              component="img"
              sx={{ width: 150, height: '100%', objectFit: 'cover', border:"1px solid #eaeaea" }}
              image={item?.image}
              alt={item.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto', }}>
              <CardContent>
                <Typography component="div" variant="h6">
                  {item.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Net Weight: {item.netWeight} g
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
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate(`/executive/ornamentuploads?filter=${customerId}`)} sx={{ mt: 2 }}>
          Add Ornament
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 2 }}>
        <Typography variant="body1">Total Items: {totalItems}</Typography>
        <Typography variant="body1">Total Net Weight: {totalNetWeight} g</Typography>
      </Box>
      <Loader loading={loading} />
    </Box>
  );
}

export default OrnamentList;
