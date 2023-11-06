import React, { useEffect, useState, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { getLeadByUser, updatedLeadApi } from "../../apis/leadsApi";
import { useSelector } from "react-redux";
import UpdateLeads from "./updateLeads";
import { DataGrid } from "@mui/x-data-grid";
import { EditOutlined, MoveUpOutlined } from "@mui/icons-material";
import Loader from "../Loader";

export default function Assignedleads() {
  const [state, setState] = React.useState({
    right: false,
  });
  const [assignedLead, setAssignedLead] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedLead, setSelectedLead] = useState({});
  const [drawer, setDrawer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);
  const post = useSelector((state)=>state);
  console.log(post.FilterReducer);

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
    // console.log(e.target.value);
    // setSelectedLead({ ...selectedLead, ['status']: e.target.value })
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

  const handleDrawer = () => {
    setDrawer((prevDrawer) => !prevDrawer);
  };

  useEffect(()=>{
    if(post.FilterReducer){
      setAssignedLead(post.FilterReducer)
    }
  },[])

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
            <Button variant="contained" color="inherit" onClick={() => {}}>
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
    <Box sx={{ ml:{md: '240px', sm: '240px', xs: '0px', lg: '240px'}, backgroundColor: "rgb(249,249,249)", p: 2}}>
      <DataGrid
        columns={columns}
        rows={assignedLead}
        getRowId={(row) => row._id}
        sx={{
          m: 4,
          fontFamily: "Poppins, sans-serif",
          boxShadow: "2px 2px 2px 2px rgb(222,226,230)",
          backgroundColor:"white",
        }}
      />
      <Loader loading={loading} />
    </Box>
  );
}
