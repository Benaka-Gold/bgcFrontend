import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { Typography } from '@mui/material';

function LeadsDivision({handleCardClick,leadCounts}) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick("All%20Leads")}>
            <Card
              sx={{
                minWidth: 255,
                boxShadow: 3,
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent
                sx={{
                  backgroundColor:
                    "linear-gradient(180deg, #EF88BB 0%, #291850 100%)",
                }}
              >
                <Typography variant="h5" component="div">
                  All Leads
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 20 }}>
                  {leadCounts.confirmed +
                    leadCounts.freshLeads +
                    leadCounts.invalid +
                    leadCounts.followUp}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick("Follow%20up")}>
            <Card
              sx={{
                minWidth: 255,
                boxShadow: 3,
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Follow Up Leads
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 20 }}>
                  {leadCounts.followUp}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick("New")}>
            <Card
              sx={{
                minWidth: 255,
                boxShadow: 3,
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Fresh Leads
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 20 }}>
                  {leadCounts.freshLeads}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => handleCardClick("Invalid")}>
            <Card
              sx={{
                minWidth: 255,
                boxShadow: 3,
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Invalid Leads
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 20 }}>
                  {leadCounts.invalid}
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
      </Grid>
    </div>
  )
}

export default LeadsDivision
