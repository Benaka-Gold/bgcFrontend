import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getTasksByStatus, getAllTasks, updateTask } from "../../../apis/task";
import { CheckOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import { getCustomerById } from "../../../apis/customer";
import CustomerView from "../../../components/Customer/CustomerView/CustomerView";
import { getOrnamentsList } from "../../../apis/ornaments";

export default function Approval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState({});
  const [customerDialog,setCustomerDialog] = React.useState(false)
  const [ornaments,setOrnaments] = React.useState()


  const handleApprove = async (data) => {
    setLoading(true);
    try {
      // Uncomment and implement your API call here
      const res = await updateTask(data._id,{...data,status : 'op_approved'})
      enqueueSnackbar("Approval successful!", { variant: "success" });
    } catch (error) {
      console.error("Error during approval:", error);
      enqueueSnackbar("Error during approval", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelection = async (params) => {
    setLoading(true)
    try{
        const res = await getCustomerById(params.row.customerId._id)
        setCustomerData(res.data)
        let orn = await getOrnamentsList(params.row.customerId._id)
        setOrnaments(orn.data)
        setCustomerDialog(true)
    }
    catch(error) {
      console.log(error)
        enqueueSnackbar("Error while fetching customer details")
    }
    finally {
        setLoading(false)
    }
  }

  const columns = [
    {
      field: "assignedTo",
      headerName: "Executive",
      flex: 1,
      renderCell: (params) => params.row.assignedTo.name,
    },
    {
      field: "customerId",
      headerName: "Customer",
      flex: 1,
      renderCell: (params) => params.row.customerId.name,
    },
    {
      field: "weight",
      headerName: "Weight",
      flex: 1,
      renderCell: (params) => params.row.weight,
    },
    {
      field: "purity",
      headerName: "Purity",
      flex: 1,
      renderCell: (params) => params.row.purity,
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
            <Box>
              <IconButton onClick={() => handleApprove(params.row)}>
                <CheckOutlined color="primary" />
              </IconButton>
            </Box>
        );
      },
    },
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchData();
    setTimeout(() => setLoading(false), 250);
  }, []);

  const fetchData = async () => {
    let res = await getTasksByStatus("op_approval");
    setRows(res.data);
  };
  return (
    <SnackbarProvider maxSnack={3}>
      <Box
        sx={{
          ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
          p: 3,
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#f7f7f8",
        }}
      >
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
            onRowDoubleClick={handleRowSelection}
          />
        </Box>
      </Box>
      <CustomerView open={customerDialog} setOpen={setCustomerDialog} customer={customerData} ornaments={ornaments} />
    </SnackbarProvider>
  );
}
