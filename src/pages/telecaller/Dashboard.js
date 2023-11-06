import  React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getLeadByUser } from '../../apis/leadsApi';
import Loader from '../../components/Loader'
import {useDispatch, useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom';

const countLeadsByType = (leads) => {
  const counts = {
    confirmed: 0,
    freshLeads: 0,
    invalid: 0,
    followUp: 0
  };

  leads.forEach(lead => {
    switch (lead.status) {
      case "Confirmed Lead":
        counts.confirmed++;
        break;
      case "New":
        counts.freshLeads++;
        break;
      case "Invalid":
        counts.invalid++;
        break;
      case "Follow up":
        counts.followUp++;
        break;
      default:
        // Handle other statuses or default case
    }
  });

  return counts;
};

export default function Dashboard() {
  const [allLeadData, setAllLeadData] = useState([]);
  const [leadCounts, setLeadCounts] = useState({
    confirmed: 0,
    freshLeads: 0,
    invalid: 0,
    followUp: 0
  });
  const [loading, setLoading] = React.useState(false)
  const dispatch = useDispatch();
  const post = useSelector((state)=>state);
  let navigate = useNavigate()



  useEffect(() => {
    const fetchLeads = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const leads = await getLeadByUser({ userId: userData._id });

      setLoading(true)
      setTimeout(() => {
        if(leads.success){
          setAllLeadData(leads.data || []);
        }else{
          alert("something went wrong")
        }
        setLoading(false)
    }, 250)
    };

    fetchLeads();
  }, []);
  

  useEffect(() => {
    if (allLeadData.length > 0) {
      setLeadCounts(countLeadsByType(allLeadData));
    }
  }, [allLeadData]);

  const handleCardClick = (type) => {
    console.log(type);
    if(type === "All%20Leads"){
      return navigate(`/telecaller/leads`)
    }else{
    return navigate(`/telecaller/leads?filter=${type}`)
    }
  };
  return (
    <Box sx={{ flexGrow: 1,p:3, ml: {md:"240px",sm:"240px", lg: '240px', fontFamily: 'Poppins, sans-serif', backgroundColor:"rgb(248,248,248)", height:"92vh" }}}>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={6} md={3} >
          <CardActionArea onClick={() => handleCardClick('All%20Leads')}>
            <Card sx={{ minWidth: 255, boxShadow: 3 , height:"200px", display:"flex" , flexDirection:"column", justifyContent:"center"}} >
              <CardContent>
                <Typography variant="h5" component="div">
                  All Leads
                </Typography>
                <Typography variant="body2">
                  {leadCounts.confirmed + leadCounts.freshLeads + leadCounts.invalid + leadCounts.followUp}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick('Follow%20up')}>
            <Card sx={{ minWidth: 255, boxShadow: 3 , height:"200px", display:"flex" , flexDirection:"column", justifyContent:"center"}}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Follow Up Leads
                </Typography>
                <Typography variant="body2">
                  {leadCounts.followUp}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick('New')}>
            <Card sx={{ minWidth: 255, boxShadow: 3 , height:"200px", display:"flex" , flexDirection:"column", justifyContent:"center"}}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Fresh Leads
                </Typography>
                <Typography variant="body2">
                  {leadCounts.freshLeads}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick('Invalid')}>
            <Card sx={{ minWidth: 255, boxShadow: 3 , height:"200px", display:"flex" , flexDirection:"column", justifyContent:"center"}}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Invalid Leads
                </Typography>
                <Typography variant="body2">
                  {leadCounts.invalid}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
      </Grid>
      <Loader loading={loading} />
    </Box>
  );
}
