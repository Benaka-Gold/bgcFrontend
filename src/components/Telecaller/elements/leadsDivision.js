import React from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Typography , Box} from '@mui/material';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';

function LeadCard({ leadType, handleCardClick, cardStyles }) {
  const handleClick = () => {
    console.log(leadType.id);
    handleCardClick(leadType.id);
  };

  return (
    <Grid item xs={12} sm={6} md={6} lg={3}>
    <CardActionArea onClick={handleClick}>
      <Card sx={{ ...cardStyles.cardBase, ...leadType.sx }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Typography variant="h5" component="div" sx={{ alignSelf: 'flex-start', fontSize:"15px" }}>
            {leadType.label}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', mt: 'auto'}}>
            <Typography variant="body2" sx={{  pl:3 , fontSize:"45px" }}>
              0{leadType.count}
            </Typography>
            <RecordVoiceOverOutlinedIcon sx={{fontSize: 'xxx-large', mb:1, mr:2}} /> 
          </Box>
        </CardContent>
      </Card>
    </CardActionArea>
  </Grid>
  );
}

// Main component
function LeadsDivision({ handleCardClick, leadCounts }) {
  const cardStyles = {
    cardBase: {
      minWidth: 255,
      boxShadow: 3,
      height: "150px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  };

  const leadTypes = [
    {
      id: "All%20Leads",
      label: 'All Leads',
      count: leadCounts.confirmed + leadCounts.freshLeads + leadCounts.invalid + leadCounts.followUp,
      sx: { borderLeft: "5px solid #4a8bfb", backgroundColor: "linear-gradient(180deg, #EF88BB 0%, #291850 100%)" },
    },
    {
      id: "Follow%20up",
      label: 'Follow Up Leads',
      count: leadCounts.followUp,
      sx: { borderLeft: "5px solid #4acfbf", backgroundColor: "linear-gradient(180deg, #88EFAB 0%, #285018 100%)" },
    },
    {
      id: "New",
      label: 'Fresh Leads',
      count: leadCounts.freshLeads,
      sx: { borderLeft: "5px solid #a84afb", backgroundColor: "linear-gradient(180deg, #EF88D5 0%, #501828 100%)" },
    },
    {
      id: "Invalid",
      label: 'Invalid Leads',
      count: leadCounts.invalid,
      sx: { borderLeft: "5px solid #fb4a4a", backgroundColor: "linear-gradient(180deg, #EF8888 0%, #503030 100%)" },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {leadTypes.map((leadType) => (
          <LeadCard
            key={leadType.id}
            leadType={leadType}
            handleCardClick={handleCardClick}
            cardStyles={cardStyles}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default LeadsDivision;
