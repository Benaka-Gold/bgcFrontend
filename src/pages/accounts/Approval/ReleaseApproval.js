import React from "react";
import { Box, IconButton, Typography} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getTasksByStatus, getAllTasks, updateTask } from "../../../apis/task";
import { CheckOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import { getCustomerById } from "../../../apis/customer";
import CustomerView from "../../../components/Customer/CustomerView/CustomerView";
import { getOrnamentsList } from "../../../apis/ornaments";
import Loader from "../../../components/Loader";
import { updateBusiness } from "../../../apis/business";

export default function ReleaseApproval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState({});
  const [customerDialog,setCustomerDialog] = React.useState(false)
  const [ornaments,setOrnaments] = React.useState()


  const handleApprove = async (data) => {
    setLoading(true);
    const user = localStorage.getItem('user')
    try {
      // Uncomment and implement your API call here
      const res = await updateTask(data._id,{...data,status : 'release_approved'})
      const bUpdate = await updateBusiness(data.businessId._id,{status : 'release_approved',releaseApprovedBy : user._id})
      enqueueSnackbar({message : "Approval successful!",  variant: "success" });
      await fetchData()
    } catch (error) {
      enqueueSnackbar({message : "Error during approval",  variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelection = async (params) => {
    setLoading(true)
    try{
        const res = await getCustomerById(params.row.customerId._id)
        setCustomerData(res.data)
        let orn = await getOrnamentsList(params.row.customerId._id,params.row.businessId._id)
        setOrnaments(orn.data)
        setCustomerDialog(true)
    }
    catch(error) {
        enqueueSnackbar({message : error.response.data.message,variant : 'error'})
    }
    finally {
        setLoading(false)
    }
  }

  const actions = (params) => {
    return (
      <Box>
        <IconButton onClick={() => handleApprove(params.row)}>
          <CheckOutlined color="primary" />
        </IconButton>
      </Box>
  );
  }

  const columns = [
    { field: "assignedTo",headerName: "Executive",flex: 0.5, renderCell: (params) => params.row.assignedTo.name,},
    { field: "customerId", headerName: "Customer", flex: 1, renderCell: (params) => params.row.customerId.name, },
    { field: "weight", headerName: "Weight", flex: 1, renderCell: (params) => params.row.weight},
    { field: "purity", headerName: "Purity",flex: 1, renderCell: (params) => params.row.purity?.purityName, },
    {field : "releasingAmount",headerName : "Releasing Amount",flex : 1, renderCell : (params) => params.row.businessId.releasingAmount},
    { field: "actions",headerName: "Actions",flex: 1,  renderCell: actions },
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchData();
    setTimeout(() => setLoading(false), 250);
  }, []);

  const fetchData = async () => {
    try {
      let res = await getTasksByStatus({status : "release_approval"});
      setRows(res.data);
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error'})
    }
  };
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <Box sx={{ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },p: 3,fontFamily: "Poppins, sans-serif", backgroundColor: "#f7f7f8", height : '90vh' }} >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: 1,
          mt: 0,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: grey[800],
            fontFamily: "Poppins, sans-serif",
            textAlign: "left",
          }}
        >
          Gold Release Approvals
        </Typography>
      </Box>
        <Box>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2,minHeight : '3vh' }}
            pageSizeOptions={[5, 10, 15]}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            onRowDoubleClick={handleRowSelection}
          />
        </Box>
      </Box>
      <CustomerView open={customerDialog} setOpen={setCustomerDialog} customer={customerData} ornaments={ornaments} />
      <Loader loading={loading}/>
    </SnackbarProvider>
  );
}
