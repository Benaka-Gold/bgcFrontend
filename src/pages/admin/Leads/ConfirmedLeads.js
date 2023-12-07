import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  DialogActions,
  FormLabel,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getLeadsByStatus } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { getUsersByRole } from "../../../apis/user";

import { LoadingButton } from "@mui/lab";
import { assignTask } from "../../../apis/task";
import AssignLeadDialog from "../../../components/Operations/AssignLeadDialog";


export default function ConfirmedLeads() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [executives, setExecutives] = React.useState([]);
  const [selectedExecutive, setSelectedExecutive] = React.useState("");
  const [appointmentTime, setAppointmentTime] = React.useState(null);
  const [assignConfirm, setAssignConfirm] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [goldType, setGoldType] = React.useState("Physical Gold");

  React.useEffect(() => {
    setLoading(true);
    fetchConfirmedLead();
    fetchExecutives();
    setTimeout(() => setLoading(false), 250);
  }, []);

  const fetchConfirmedLead = async () => {
    const leads = await getLeadsByStatus("Confirmed");
    setRows(leads.data);
  };

  const fetchExecutives = async () => {
    const res = await getUsersByRole("executive");
    setExecutives(res.data);
  };

  const confirmLeadFunc = async (formData) => {
    setAssignConfirm(true);
    setLoading(true);
    const data = {
      ...formData,
      lead : selectedRow,
    }
    // console.log(data);
    try{
      const res = await assignTask(data);
      console.log(res)
      if(res.status === 200){
        alert("Lead assigned successfully!")
        setLoading(false)
      }
    } catch(error) {
      alert("Error : ",error)
      setLoading(false)
    }
  };
  const columns = [
    { field: "name", headerName: "Name", columnMenu: false, flex: 1 },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      columnMenu: false,
      flex: 1,
    },
    { field: "status", headerName: "Status", columnMenu: false, flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      columnMenu: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <LoadingButton
              loading={assignDialogOpen}
              variant="contained"
              color="primary"
              onClick={() => {
                setAssignDialogOpen(true);
                setSelectedRow(params.row);
              }}
              endIcon={<AddOutlined />}
            >
              Assign
            </LoadingButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
        p: 3,
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f7f7f8",
        height: "90vh",
      }}
    >
      <Box>
        <Typography
          sx={{ fontFamily: "Poppins, sans-serif", textAlign: "left" }}
          variant="h5"
        >
          Confirmed Leads
        </Typography>
      </Box>
      <Box sx={{minHeight : '5vh',height:'50vh'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          sx={{ boxShadow: 4,
        fontFamily: "Poppins, sans-serif",
      }}
          disableRowSelectionOnClick
        />
      </Box>
      <Loader loading={loading} />
      <AssignLeadDialog confirmLeadFunc={confirmLeadFunc} assignConfirm={assignConfirm} setAssignConfirm={setAssignConfirm} executives={executives} assignDialogOpen={assignDialogOpen} setAssignDialogOpen={setAssignDialogOpen} />
    </Box>
  );
}
