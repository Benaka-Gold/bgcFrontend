import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box, Dialog, DialogContent, Modal } from "@mui/material";
import { getLeadByUser, updatedLeadApi } from "../../apis/leadsApi";
import UpdateLeads from "./elements/updateLeads";
import { DataGrid } from "@mui/x-data-grid";
import { EditOutlined, MoveUpOutlined } from "@mui/icons-material";
import Loader from "../Loader";
import Typography from "@mui/material/Typography";
import { getTeamByType } from "../../apis/team";
import { useLocation } from 'react-router-dom';
import { AddCircleOutline } from "@mui/icons-material";
import {Divider} from "@mui/material";
import LeadForm from "../Leads/LeadForm";
import MoveLeads from "./elements/moveLeads";
import { createLead } from "../../apis/leadsApi";


export default function Assignedleads() {
  const [assignedLead, setAssignedLead] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedLead, setSelectedLead] = useState({});
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moveLeadModel, setMoveLeadModel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedteam] = useState("")
  const [filter, setFilter] = useState(null)
  const location = useLocation();
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);


  // Fetch Leads Based on TeleCaller ID 
  async function leadsById() {
    let payload = {
      userId: userData._id,
    };
    let leadsById = await getLeadByUser(payload);
    setLoading(true);
    setTimeout(() => {
      if (leadsById.success) {
        console.log(leadsById.data);
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
      assignedLead.filter((item) => {
        if (item._id === String(selectedId)) {
           return setSelectedLead(item);
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
      data?.forEach(row => {
        if (row.status === nf) {
          filteredRows.push(row)
        }
      });
      setAssignedLead(filteredRows)
    }
  }

  
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

  const sourceFunc = (e)=>{
    setLoading(true)
    setTimeout(()=>{
      setSelectedLead({ ...selectedLead, ['source']: e.target.value });
      setLoading(false);
    },250)
   
  }
  // UpdateLeads by TeleCallers 
  const updateFunc = async () => {
    let updated = {
      purity: selectedLead.purity,
      status: selectedLead.status,
      weight: Number(selectedLead.weight),
      feedback: selectedLead.feedback,
      source:selectedLead.source,
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

  
  // Fetching All teams 
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
  // Moving Leads to other Team
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

  
  //  Creating New Leads 
  const handleFormSubmit = async (formData) => {
  const updatedFormData = {
    ...formData,
    assignedTeam:userData.teamId,
    assignedTo:userData._id,
    weight: Number(formData.weight)
  };
  console.log(updatedFormData);
  setIsModalOpen(false)
  setLoading(true)
  const response = await createLead(updatedFormData);
   if (response.status) {
    console.log(response);
    setTimeout(()=>{
      console.log(updatedFormData);
      setLoading(false)
    },250)
   }
   leadsById()
  };

  const modalBody = (
    <Box >
        <Typography variant="h5">
            Add a new Lead
        </Typography>
        <Divider  />
        <LeadForm onSubmit={handleFormSubmit} teams={teams} role="Telecaller"  />
    </Box>
)
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
            <Button variant="contained" onClick={() => {
                setSelectedId(params.row._id);
                handleDrawer() }} >
              <EditOutlined />
            </Button>
            <Button variant="contained" color="inherit" onClick={() => { setMoveLeadModel(true) 
              setSelectedLead(params.row) }}>
              <MoveUpOutlined />
            </Button>
            <Modal aria-labelledby="modal-title" aria-describedby="modal-desc"  open={drawer} onClose={() => setDrawer(false)}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <UpdateLeads selectedLead={selectedLead} feedbackFunc={feedbackFunc} handleChange={handleChange} updateFunc={updateFunc} sourceFunc={sourceFunc} loading={loading} />
            </Modal>
          </Box>
        );
      },
    },
  ];
  return (
    <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', display: "flex", flexDirection: "column" }, height: "92vh", p: -1, backgroundColor: "#f7f7f8" }}>
      <Box>
        <Box sx={{display:"flex", justifyContent:"space-between", m:4, fontFamily: 'Poppins, sans-serif'}}>
      <Typography variant="h6" sx={{fontFamily: 'Poppins, sans-serif'}}>Assigned Leads</Typography>
      <Button onClick={()=> setIsModalOpen(true)} variant='contained' color='primary'>
                    <AddCircleOutline />
                    <Typography style={{ color: '#efefef' }} >
                        Add a Lead
                    </Typography>
                </Button>
                </Box>

      {(filter !== null) ? <Button onClick={() => {
        setFilter(null)
        leadsById();
      }}>Clear Filter</Button> : null}
      
      <DataGrid
      columns={columns}
      rows={assignedLead}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row._id}
        sx={{ fontFamily: 'Poppins, sans-serif', boxShadow: "2px 2px 2px 2px rgb(222,226,230)", backgroundColor: "white", m:4 }}
      />
      <Loader loading={loading} />
      
      <MoveLeads moveLeadModel={moveLeadModel} handleClose={handleClose} style={style} handleTeams={handleTeams} teams={teams} handleMoveLead={handleMoveLead} />


      <Dialog open={isModalOpen} onClose={()=>setIsModalOpen(false)}>
        <DialogContent>
          {modalBody}
        </DialogContent>
      </Dialog>
      </Box>
    </Box>
  );
}
