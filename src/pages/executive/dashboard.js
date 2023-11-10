import React from "react";
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

function Dashboard() {
  const [loading, setLoading] = React.useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 250);
  };

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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height:"70px",
          alignItems:"center",
          m: 1,
        }}
      >
        <CardActionArea onClick={handleRefresh}>
          <Card sx={{
            width: "100%",
            height:"70px",
            boxShadow: 3,
            background: "white",
            borderRadius: "16px",
            transition: "box-shadow 0.3s ease-in-out",
            '&:hover': {
              boxShadow: "0 12px 24px 0 rgba(0, 0, 0, 0.2)",
            },
           
          }}>
            <CardContent
              sx={{
                width:"100%",
                height:"100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                px: 3,
                margin:"auto"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar src="/broken-image.jpg" sx={{ width: 45, height: 45, mt: 1, mr:2 }} />
                <Box>
                  <Typography sx={{
                    fontWeight: "medium",
                    fontSize: "1rem",
                    color: "black",
                    fontFamily: "Poppins, sans-serif",
                  }}>
                    Chandru
                  </Typography>
                  <Typography sx={{
                    fontSize: "0.75rem",
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                  }}>
                    Released Gold
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosIcon sx={{ fontSize: 20, color: "#bdbdbd" }} />
            </CardContent>
          </Card>
        </CardActionArea>
      </Box>


     
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
        <Typography sx={{ fontWeight: "medium" }}>
          In hand Cash: ₹ 1,00,000
        </Typography>
        <Typography sx={{ fontWeight: "medium" }}>
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
