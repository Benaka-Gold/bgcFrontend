import React, { useEffect, useState, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { Box, Modal } from "@mui/material";
import { getLeadByUser, updatedLeadApi } from "../../../apis/leadsApi";
import UpdateLeads from "./updateLeads";
import { DataGrid } from "@mui/x-data-grid";
import { EditOutlined, MoveUpOutlined } from "@mui/icons-material";
import Loader from "../../../components/Loader";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from "@mui/material/Typography";
import { getTeamByType } from "../../../apis/team";
import { useLocation } from 'react-router-dom';


export default function Assignedleads() {
  const [state, setState] = React.useState({
    right: false,
  });
  const [assignedLead, setAssignedLead] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedLead, setSelectedLead] = useState({});
  const [drawer, setDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [moveLeadModel, setMoveLeadModel] = React.useState(false);
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedteam] = useState("")
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);
  const [filter, setFilter] = React.useState(null)
  const location = useLocation();
 


  async function leadsById() {
    let payload = {
      userId: userData._id,
    };
    let leadsById = await getLeadByUser(payload);
    setLoading(true);
    setTimeout(() => {
      if (leadsById.success) {
        setAssignedLead(leadsById.data);
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
      checkFilter(leadsById.data)
    }, 250);
  }


  React.useEffect(() => {
    leadsById();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const data = assignedLead.filter((item) => {
        if (item._id === String(selectedId)) {
          setSelectedLead(item);
        }
      });
    }
  }, [selectedId]);


  const checkFilter = (data) => {
    const query = new URLSearchParams(location.search)
    let nf = query.get('filter')
    if (nf !== null) {
      setFilter(filter)
      const filteredRows = []
      data.forEach(row => {
        if (row.status === nf) {
          filteredRows.push(row)
        }
      });
      setAssignedLead(filteredRows)
    }
  }

  useEffect(() => {
    toggleDrawer("right", drawer);
  }, [drawer]);

  const toggleDrawer = (anchor, open, id) => (event) => {
    setSelectedId(id);
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleChange = (e) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedLead({ ...selectedLead, ["status"]: e.target.value });
      setLoading(false);
    }, 250);
  };

  const feedbackFunc = (e) => {
    let { name, value } = e.target;
    setSelectedLead({ ...selectedLead, [name]: value });
  };

  const updateFunc = async () => {
    let updated = {
      purity: selectedLead.purity,
      status: selectedLead.status,
      weight: Number(selectedLead.weight),
      feedback: selectedLead.feedback,
    };
    let res = await updatedLeadApi(selectedId, updated);
    setLoading(true);
    setTimeout(() => {
      if (res.success) {
        setDrawer(false);
        leadsById();
      } else {
        alert("Something went wrong");
      }
      setLoading(false);
    }, 250);
  };
  const handleClose = () => setMoveLeadModel(false);
  const handleDrawer = () => {
    setDrawer((prevDrawer) => !prevDrawer);
  };



  const fetchTeams = async () => {
    const res = await getTeamByType("Telecaller")
    if (res.status) {
      setTeams(res.data.data)
    }
  }

  React.useEffect(() => {
    fetchTeams()
  }, [])

  const handleTeams = (event) => {
    setSelectedteam(event.target.value)
  }
  const handleMoveLead = async () => {
    let updated = {
      moveLead: true,
      moveTo: selectedTeam
    };
    const res = await updatedLeadApi(selectedLead._id, updated)
    setLoading(true)
    setMoveLeadModel(false)
    setTimeout(() => {
      if (res.success) {
        setLoading(false)
      } else {
        alert("Something went wrong")
      }
      leadsById()
    }, 250)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex" }} gap={2}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedId(params.row._id);
                handleDrawer();
              }}
            >
              <EditOutlined />
            </Button>
            <Button variant="contained" color="inherit" onClick={() => {
              setMoveLeadModel(true)
              setSelectedLead(params.row)
            }}>
              <MoveUpOutlined />
            </Button>
            <Drawer
              PaperProps={{
                sx: { width: { md: "50%", sm: "75%", xs: "100%", lg: "40%" } },
              }}
              anchor={"right"}
              open={drawer}
              onClose={handleDrawer}
              BackdropProps={{
                sx: { backgroundColor: "rgba(0, 0, 0, 0.2)" }, // Adjust the opacity (0.3 in this example)
              }}
            >
              <UpdateLeads
                selectedLead={selectedLead}
                feedbackFunc={feedbackFunc}
                handleChange={handleChange}
                updateFunc={updateFunc}
                loading={loading}
              />
            </Drawer>
          </Box>
        );
      },
    },
  ];
  return (
    <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', display: "flex", flexDirection: "column" }, p: 2 }}>
      <Typography variant="h6" sx={{ display: "flex", flexDirection: "row", pl: 5 }}>Assigned Leads</Typography>
      {(filter !== null) ? <Button onClick={() => {
        setFilter(null)
        leadsById();
      }}>Clear Filter</Button> : null}
      <DataGrid
        columns={columns}
        rows={assignedLead}
        getRowId={(row) => row._id}
        sx={{
          m: 4,
          fontFamily: "Poppins, sans-serif",
          boxShadow: "2px 2px 2px 2px rgb(222,226,230)",
          backgroundColor: "white",
        }}
      />
      <Loader loading={loading} />
      <Modal
        open={moveLeadModel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
            MoveLeads
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Teams</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ marginTop: "10px" }}
              onChange={handleTeams}
            >
              {teams && teams.map((item) => (
                <MenuItem value={item._id} key={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" style={{ marginTop: "25px" }} onClick={handleMoveLead} >Update</Button>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
}