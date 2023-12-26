import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ConfirmationModel from "./elements/ConfirmationModel";
import { freshLeads, getLeadsByTeam } from "../../apis/leadsApi";
import { getTeamsById } from "../../apis/team";
import Typography from "@mui/material/Typography";
import Loader from "../Loader";
import CustomeFilter from "./elements/customeFilter";
import { Fade } from "@mui/material";
import { enqueueSnackbar, SnackbarProvider } from "notistack";


const columns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phoneNumber", headerName: "Number", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];

const summaryColumns = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "new", headerName: "New", flex: 1 },
  { field: "followup", headerName: "Follow Ups", flex: 1 },
  { field: "confirmedlead", headerName: "Confirmed", flex: 1 },
  { field: "invalid", headerName: "Invalid", flex: 1 },
  { field: "total", headerName: "Total", flex: 1 },
];

export default function LeadTable() {
  const [userId, setUserId] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [leadsData, setLeadsdata] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [teleTeams, setTeleTeams] = useState([]);
  const [customeRow, setCustomeRow] = useState([]);
  const [display, setDisplay] = useState(true);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [teamLeadsData, setTeamLeadsData] = useState([]);
  const [visible, setVisible] = useState(true);
  const items = JSON.parse(localStorage.getItem("user"));
  const fetchData = async () => {
    try {
      let newVar = await getLeadsByTeam(items.teamId);
      setTeamLeadsData(newVar.data);
      // teamMembersLeads()
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchTeamById = async () => {
    try {
      let newVar = await getTeamsById(items.teamId);
      setLoading(true);
      setTimeout(() => {
        if (newVar.success) {
          setTeleTeams(newVar.data);
        }
        setLoading(false);
      }, 250);
    } catch (error) {
      enqueueSnackbar({message :error.message,variant : 'error'})
    }
  };
  const newLeads = async () => {
    try{
    const res = await freshLeads(items.teamId);
    if (res.success) {
      setLeadsdata(res.data);
    }}catch(error){
      enqueueSnackbar({message :error.message,variant : 'error'})
    }
  };

  React.useEffect(() => {
    fetchData();
    fetchTeamById();
    newLeads();
  }, []);

  React.useEffect(() => {
    if (leadsData) {
      const data = leadsData.map((lead) => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phoneNumber: lead.phoneNumber,
        status: lead.status,
      }));
      setFormattedData(data);
    }
  }, [leadsData]);

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows);
  };

  const handleSelected = (rows) => {
    setLoading(true);
    setTimeout(() => {
      setCustomeRow(rows);
      setDisplay(false);
      setVisible(false);
      setLoading(false);
    }, 250);
  };

  const handleChange = (event) => {
    setUserId(event.target.value);
  };

  function summarizeLeads(data) {
    const summary = {};
    data.forEach((item) => {
      if (item.assignedTo && item.assignedTo._id) {
        const id = item.assignedTo._id;
        const statusNormalized = item.status
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");
        if (!summary[id]) {
          summary[id] = {
            id: id,
            name: item.assignedTo.name,
            leadsStatus: {},
          };
        }
        if (!summary[id].leadsStatus[statusNormalized]) {
          summary[id].leadsStatus[statusNormalized] = 0;
        }
        summary[id].leadsStatus[statusNormalized]++;
      }
    });
    return Object.values(summary);
  }
  useEffect(() => {
    let result = summarizeLeads(teamLeadsData);
    const transformedResult = result.map((item) => ({
      id: item.id,
      name: item.name,
      followup: item.leadsStatus["followup"] || 0,
      confirmedlead: item.leadsStatus["confirmed"] || 0,
      invalid: item.leadsStatus["invalid"] || 0,
      new: item.leadsStatus["new"] || 0,
      total:
        (item.leadsStatus["followup"] || 0) +
        (item.leadsStatus["confirmed"] || 0) +
        (item.leadsStatus["invalid"] || 0) +
        (item.leadsStatus["new"] || 0) || 0,
    }));
    setSummary(transformedResult);
  }, [teamLeadsData]);
  
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box
      sx={{ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },p: 3,fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f7f7f8", height: "93vh",}}>
      <Typography variant="h6" sx={{ display: "flex", flexDirection: "row", pl: 5, fontSize: "25px" }}>
        All Leads
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }} gap={2}>
        <FormControl sx={{ width: "100px" }} disabled={selectedRows.length <= 0 ? true : false}>
          <InputLabel  id="demo-simple-select-label" sx={{ fontFamily: "Poppins, sans-serif", backgroundColor: "white" }}>
            Team
          </InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={userId} label="user"
            onChange={handleChange}
            sx={{ backgroundColor: "white" }}
          >
            {teleTeams && teleTeams.map((item) => (<MenuItem value={item._id} key={item._id}> {item.name}</MenuItem>))}
          </Select>
        </FormControl>
        <ConfirmationModel selectedRows={selectedRows} userId={userId} leadsData={leadsData}
          setLeadsdata={setLeadsdata} fetchTeamById={fetchTeamById}  newLeads={newLeads} fetchData={fetchData} />
      </Box>

      <DataGrid
        rows={formattedData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectedRows}
        sx={{
          fontFamily: "Poppins, sans-serif",
          boxShadow: "2px 2px 2px 2px rgb(222,226,230)",
          backgroundColor: "white",
        }}
      />
      <Loader loading={loading} />

      <Typography
        variant="h6"
        sx={{display: "flex", flexDirection: "row", pl: 5,fontSize: "25px", p: 3, }}>
        Leads Distribution
      </Typography>

      {display ? (
        <DataGrid rows={summary} columns={summaryColumns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },},}}
          autoHeight
          pageSizeOptions={[5, 10, 15]}
          checkboxSelection
          sx={{
            fontFamily: "Poppins, sans-serif",
            boxShadow: "2px 2px 2px 2px rgb(222,226,230)",
            backgroundColor: "white",
          }}
          onRowSelectionModelChange={handleSelected}
        />
      ) : (
        <Fade in={!visible} timeout={500} unmountOnExit>
          <Box
            sx={{ width: "100%",display: "flex",flexDirection: "column",  alignItems: "center" }} >
            <CustomeFilter  setDisplay={setDisplay} customeRow={customeRow}  teamLeadsData={teamLeadsData}    setLoading={setLoading}/>
          </Box>
        </Fade>
      )}
    </Box>
    </SnackbarProvider>
  );
}
