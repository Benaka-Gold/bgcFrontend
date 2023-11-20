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
  FormLabel
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getLeadsByStatus } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { getUsersByRole } from "../../../apis/user";
import {
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LoadingButton } from "@mui/lab";


export default function ConfirmedLeads() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [executives, setExecutives] = React.useState([]);
  const [selectedExecutive, setSelectedExecutive] = React.useState("");
  const [appointmentTime, setAppointmentTime] = React.useState(null);
  const [assignConfirm,setAssignConfirm] = React.useState(false)

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

  const handleExecutiveSelection = (e) => {
    setSelectedExecutive(e.target.value);
  };

  const confirmLeadFunc = async () => {
    setAssignConfirm(true)
    setLoading(true)
    // await confirmLeadFunc(id)
    console.log(selectedExecutive);
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
               }}
               endIcon={<AddOutlined />}>Assign</LoadingButton>
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
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          sx={{ boxShadow: 4 }}
          disableRowSelectionOnClick
        />
      </Box>
      <Loader loading={loading} />
      <Dialog
        maxWidth="md"
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(!assignDialogOpen)}
      >
        <DialogTitle sx={{fontFamily : 'Poppins'}} variant="h6">Assign Lead to Executive</DialogTitle>
        <DialogContent>
          <Box>
            <FormLabel>Executive</FormLabel>
            <Select
              fullWidth
              defaultValue={""}
              onChange={handleExecutiveSelection}
            >
              {executives.map((exec, index) => {
                return (
                  <MenuItem value={exec._id} key={index}>
                    {exec.name}
                  </MenuItem>
                );
              })}
            </Select>
            <FormLabel>Appointment Time</FormLabel>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <TimePicker
                  label="Appointment Time"
                  value={appointmentTime}
                  onChange={(newValue) => {
                    setAppointmentTime(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
            <LoadingButton loading={assignConfirm} onClick={confirmLeadFunc} variant="contained">Confirm</LoadingButton>
            <Button onClick={()=>{
                setAssignDialogOpen(!assignDialogOpen)
                setAssignConfirm(false)
                setLoading(false)
            }} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
