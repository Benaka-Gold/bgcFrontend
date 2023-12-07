import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getLeadByUser } from "../../apis/leadsApi";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import PieChart from "../../components/Telecaller/elements/pieChart";
import LeadsDivision from "../../components/Telecaller/elements/leadsDivision";

const countLeadsByType = (leads) => {
  const counts = {
    confirmed: 0,
    freshLeads: 0,
    invalid: 0,
    followUp: 0,
  };

  leads.forEach((lead) => {
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
    followUp: 0,
  });
  const [loading, setLoading] = React.useState(false);
  let navigate = useNavigate();
  const isTeamLeader = JSON.parse(localStorage.getItem("isteamLead"));

  useEffect(() => {
    const fetchLeads = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const leads = await getLeadByUser({ userId: userData._id });

      setLoading(true);
      setTimeout(() => {
        if (leads.success) {
          setAllLeadData(leads.data || []);
        } else {
          alert("something went wrong");
        }
        setLoading(false);
      }, 250);
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    if (allLeadData.length > 0) {
      setLeadCounts(countLeadsByType(allLeadData));
    }
  }, [allLeadData]);

  const handleCardClick = (type) => {
    if (type === "All%20Leads") {
      return navigate(`/telecaller/leads`);
    } else {
      return navigate(`/telecaller/leads?filter=${type}`);
    }
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        ml: { md: "240px", sm: "240px", lg: "240px" },
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "rgb(248,248,248)",
        height: { md: "92vh", xs: "auto", sm: "240px", lg: "92vh" },
      }}
    >
      < LeadsDivision handleCardClick={handleCardClick} leadCounts ={leadCounts} />

      {isTeamLeader[0].isTL ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection:"column",
            height: "350px",
            mt:4
          }}
        >
          <Typography sx={{ fontFamily: "Poppins, sans-serif",}}>Team Leads</Typography>
          <PieChart />
        </Box>
      ) : (
        ""
      )}

      <Loader loading={loading} />
    </Box>
  );
}
