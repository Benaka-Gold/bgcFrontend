import React from "react";
import { Box,IconButton,Typography,} from "@mui/material";
import { AddOutlined, CheckCircleOutline } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import { DataGrid } from "@mui/x-data-grid";
import { getLeadsByStatus, updatedLeadApi } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { getUsersByRole } from "../../../apis/user";
import { LoadingButton } from "@mui/lab";
import { assignTask } from "../../../apis/task";
import AssignLeadDialog from "../../../components/Operations/AssignLeadDialog";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import CancelLeadDialog from "../../../components/Operations/CancelLeadDialog";

export default function ConfirmedLeads() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [executives, setExecutives] = React.useState([]);
  const [assignConfirm, setAssignConfirm] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [selectedCancel, setSelectedCancel] = React.useState(null)
 console.log(selectedRow);

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

  const handleVerify = async(params)=>{
    setLoading(true)
    try {
      const res = await updatedLeadApi(params.row._id,{verified : true})
      if(res){
        enqueueSnackbar({message : "Verified Successfully",variant : 'success'})
      }
    } catch (error) {
      enqueueSnackbar({message : error.message,variant : 'error'})
    } finally {
      fetchConfirmedLead()
      setLoading(false)
    }
  }

  const handleCanel= (params)=>{
    setCancelDialogOpen(true)
    setSelectedCancel(params.row)
  }

  const handleSubmitCancelReason = async(reason) => {
    setLoading(true)
    console.log("Cancel reason submitted: ", reason);
    setCancelDialogOpen(false);
    try{
      const leadRes= await updatedLeadApi(selectedCancel._id,{ status :"cancelled", feedback:reason})
      fetchConfirmedLead()
    }catch(error){
      enqueueSnackbar({message : error.message,variant : 'error'})
    }finally{
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
            {!params.row.verified 
            ? 
              <IconButton onClick={()=>handleVerify(params)}>
                <CheckCircleOutline color="success"/>
              </IconButton> 
            : <LoadingButton
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
              }
              {!params.row.verified  ? 
              <IconButton onClick={()=> handleCanel(params)}> 
                <CancelIcon color="error"/>
              </IconButton> : ""}
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
      <Box sx={{minHeight : '5vh',height:'5vh',mt:1}}>
        <DataGrid
          rows={rows}
          autoHeight
          columns={columns}
          getRowId={(row) => row._id}
          sx={{ boxShadow: 2,
        fontFamily: "Poppins, sans-serif",
      }}
          disableRowSelectionOnClick
        />
      </Box>
      <Loader loading={loading} />
      <AssignLeadDialog confirmLeadFunc={confirmLeadFunc} assignConfirm={assignConfirm} setAssignConfirm={setAssignConfirm} executives={executives} assignDialogOpen={assignDialogOpen} setAssignDialogOpen={setAssignDialogOpen} />
      <CancelLeadDialog  cancelDialogOpen={cancelDialogOpen} setCancelDialogOpen={setCancelDialogOpen} onSubmit={handleSubmitCancelReason}/>
    </Box>
    </SnackbarProvider>
  );
}
