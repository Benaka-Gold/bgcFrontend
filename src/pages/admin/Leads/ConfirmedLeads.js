import React from "react";
import { Box,Typography,} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getLeadsByStatus } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { getUsersByRole } from "../../../apis/user";
import { LoadingButton } from "@mui/lab";
import { assignTask } from "../../../apis/task";
import AssignLeadDialog from "../../../components/Operations/AssignLeadDialog";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function ConfirmedLeads() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [executives, setExecutives] = React.useState([]);
  const [assignConfirm, setAssignConfirm] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

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
    const user = JSON.parse(localStorage.getItem('user'))
    const userDivisionId = user.division;
    console.log(userDivisionId)
    try{
      const res = await getUsersByRole("executive");
      const filteredExecutives = res.data.filter(executive => executive.division === userDivisionId);
      setExecutives(filteredExecutives);
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error'})
    }

  };

  const confirmLeadFunc = async (formData) => {
    setAssignConfirm(true);
    setLoading(true);
    const data = {
      ...formData,
      lead : selectedRow,
    }
    try{
      const res = await assignTask(data);
      if(res.status === 200){
        enqueueSnackbar({message :'Lead assigned successfully!',variant : 'success'})
      }
    } catch(error) {
      enqueueSnackbar({message :error.message,variant : 'error'})
    }
    finally {
      setLoading(false)
      setAssignConfirm(false);
      setAssignDialogOpen(false)
      fetchConfirmedLead()
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
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
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
      <Box sx={{minHeight : '5vh',height:'5vh'}}>
        <DataGrid
          rows={rows}
          autoHeight
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
    </SnackbarProvider>
  );
}
