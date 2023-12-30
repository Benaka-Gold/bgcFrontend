import React, {useEffect, useState} from "react";
import {Box, Typography, Fab, Card,CardActionArea,CardContent , Avatar ,Grid} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/Loader";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {useNavigate} from "react-router-dom";
import { executiveTask } from "../../apis/task";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import moment from "moment"

function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [assignTask, setAssignedTask] = useState([])
  let navigate = useNavigate()
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await executiveTask();
      if (res.status === 200) {
        setTimeout(()=>{
          let filtered = res?.data?.data?.filter((item)=>{
            return item.assignedTo === userData._id 
          })
          console.log(filtered);
          setAssignedTask(filtered);
          setLoading(false)
        }, 250)
      } 
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }
  useEffect(() => {
    fetchData()
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchData()
      setLoading(false);
    }, 250);
  };

  const handleCardClick =(id)=>{
    navigate(`customerdetails?filter=${id}`)
  }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box sx={{  ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, display: "flex", flexDirection: "column", minHeight: "91.5vh",
        fontFamily: "Poppins, sans-serif", backgroundColor: "#f7f7f8",  p: 3 }} >
      <Typography   variant="h4" component="h1"  sx={{  fontWeight: "bold",  mb: 2, fontFamily: "Poppins, sans-serif", fontSize: "1.5rem",  color: "#333", }}>
        Assigned Jobs
      </Typography>
     
        {assignTask.length === 0 &&
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', width: '100%', }}>
            <Typography sx={{ fontWeight: 'bolder', fontSize: '1rem', color: 'black', fontFamily: 'Poppins, sans-serif' }}>
              No Task Assigned
            </Typography>
          </Box>
        }

      <Grid container spacing={2}>
        {assignTask.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <CardActionArea onClick={() => handleCardClick(item.customerId?._id)}>
              <Card sx={{ display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: "16px", '&:hover': { boxShadow: "0 12px 24px 0 rgba(0, 0, 0, 0.2)" } }}>
                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2, px: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src="/broken-image.jpg" sx={{ width: 45, height: 45, mr: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <Typography sx={{ fontWeight: "medium", fontSize: "1rem", color: "black" }}>{item?.customerId?.name}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "RGB(140, 140, 140)" }}>{item.description}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "RGB(140, 140, 140)" }}>{moment(item.appointmentTime).format("lll")}</Typography>
                    </Box>
                  </Box>
                  <ArrowForwardIosIcon sx={{ fontSize: 20, color: "#bdbdbd" }} />
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>

     
      <Box sx={{ flexGrow: 1 }} />
      

      <Fab  color="primary" aria-label="refresh"
        sx={{ position: "fixed", bottom: 16,right: 16, backgroundColor: "#1976d2" }}  onClick={handleRefresh} >
        <CachedIcon />
      </Fab>
      <Loader loading={loading} />
      
    </Box>
    </SnackbarProvider>
  );
}

export default Dashboard;
