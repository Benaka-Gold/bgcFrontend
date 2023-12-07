import React, {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import CachedIcon from "@mui/icons-material/Cached";
import Loader from "../../components/Loader";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Avatar from '@mui/material/Avatar';
import {useNavigate} from "react-router-dom";
import { executiveTask } from "../../apis/task";
import { Grid } from "@mui/material";
import moment from "moment"

function Dashboard() {
  const [loading, setLoading] = React.useState(false);
  const [assignTask, setAssignedTask] = useState([])
  let navigate = useNavigate()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await executiveTask();
        if (res.status === 200) {
          console.log(res.data.data);
          setAssignedTask(res.data.data);
        } else {
          alert("Something went wrong Try again");
        }
      } catch (error) {
        // Handle the error appropriately
        console.error("An error occurred: ", error);
      }
    };
  
    setLoading(true);
    fetchData().then(() => setLoading(false));
  }, []);
// console.log(assignTask);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 250);
  };

  const handleCardClick =(id)=>{
    navigate(`customerdetails?filter=${id}`)
  }
  return (
    <Box
      sx={{
        ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
        display: "flex",
        flexDirection: "column",
        minHeight: "90vh",
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f7f7f8",
        p: 3
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.5rem",
          color: "#333",
        }}
      >
        Assigned Jobs
      </Typography>

    
      <Grid container spacing={2}>
        {assignTask.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <CardActionArea onClick={() => handleCardClick(item.customerId._id)}>
              <Card sx={{ display: "flex", flexDirection: "column", boxShadow: 3, borderRadius: "16px", '&:hover': { boxShadow: "0 12px 24px 0 rgba(0, 0, 0, 0.2)" } }}>
                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 2, px: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src="/broken-image.jpg" sx={{ width: 45, height: 45, mr: 2 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <Typography sx={{ fontWeight: "medium", fontSize: "1rem", color: "black" }}>{item.customerId.name}</Typography>
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

      <Box
        sx={{
          m: 1,
          p: 2,
          backgroundColor: "white",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
          borderRadius: "5px",
        }}
      >
        <Typography sx={{ fontWeight: "medium",  fontFamily: "Poppins, sans-serif", }}>
          In hand Cash: ₹ 1,00,000
        </Typography>
        <Typography sx={{ fontWeight: "medium" ,  fontFamily: "Poppins, sans-serif",}}>
          EOD Cash to be Submitted: ₹ 1,00,000
        </Typography>
      </Box>

      <Fab
        color="primary"
        aria-label="refresh"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#1976d2",
        }}
        onClick={handleRefresh}
      >
        <CachedIcon />
      </Fab>
      <Loader loading={loading} />
    </Box>
  );
}

export default Dashboard;
