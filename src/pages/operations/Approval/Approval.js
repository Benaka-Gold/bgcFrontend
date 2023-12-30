import React from "react";
import { Box,IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getTasksByStatus, updateTask } from "../../../apis/task";
import { CheckOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import { getCustomerById } from "../../../apis/customer";
import CustomerView from "../../../components/Customer/CustomerView/CustomerView";
import { getOrnamentsList } from "../../../apis/ornaments";
import Loader from "../../../components/Loader";
import {  updateBusiness } from "../../../apis/business";
// import CancelLeadDialog from "../../../components/Operations/CancelLeadDialog";
import { CancelOutlined } from "@mui/icons-material";
import { updatedLeadApi } from "../../../apis/leadsApi";

export default function Approval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState({});
  const [customerDialog,setCustomerDialog] = React.useState(false)
  const [ornaments,setOrnaments] = React.useState()
  const [businessDetails,setBusinessDetails] = React.useState({})
  // const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  // const [selectedCancel, setSelectedCancel] = React.useState(null)

  const handleApprove = async (data) => {
    setLoading(true);
    try {
      switch(data.status) {
        case 'op_approval' : 
          const res = await updateTask(data._id,{status : 'accounts_approval'});
          const res2 = await updateBusiness(data.businessId._id,{status : 'accounts_approval'});
          enqueueSnackbar({message : "Approval successful!", variant: "success" });
          break;
        case 'cancel_approval' : {
          const res = await updateTask(data._id,{status : 'cancel_approved'});
          const res2 = await updateBusiness(data.businessId._id,{status : 'cancelled'});
          enqueueSnackbar({message : "Cancel successful!", variant: "success" });
          break;
        }
        case 'comp_approved' : {
          const res = await updateTask(data._id,{status : 'op_approved'});
          const res2 = await updateBusiness(data.businessId._id,{status : 'op_approved'});
          enqueueSnackbar({message : "Approval successful!", variant: "success" });
          break;
        }
        case "release_op_approval" :{
          const res = await updateTask(data._id,{status : 'purchase_acc_approval'});
          const res2 = await updateBusiness(data.businessId._id,{status : 'purchase_acc_approval'});
          enqueueSnackbar({message : "Approval successful!", variant: "success" });
          break;
        }
        case "purchase_op_aapproval" :{
          const res = await updateTask(data._id,{status : "purchase_op_aapproved"});
          const res2 = await updateBusiness(data.businessId._id,{status : "purchase_op_aapproved"});
          enqueueSnackbar({message : "Approval successful!", variant: "success" });
          break;
        }
        default : break;
      }
      await fetchData();
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelection = async (params) => {
    if (["release_approval", "comp_approval"].includes(params.row.status)) {
      return; 
    }
    setLoading(true)
    try{
        const res = await getCustomerById(params.row.customerId._id)
        setCustomerData(res.data)
        let orn = await getOrnamentsList(params.row.customerId._id,params.row.businessId._id)
        setBusinessDetails(params.row.businessId)
        setOrnaments(orn.data)
        setCustomerDialog(true)
    }
    catch(error) {
      enqueueSnackbar({message : "Error while fetching customer details",variant : 'error'})
    }
    finally {
      setLoading(false)
    }
  }

  const columns = [
    { field: "assignedTo", headerName: "Executive", flex: 1,renderCell: (params) => params.row.assignedTo.name, },
    { field: "customerId", headerName: "Customer", flex: 1, renderCell: (params) => params.row.customerId.name,},
    { field: "description", headerName: "Description", flex: 1, renderCell: (params) => params.row.purity?.purityName, },
    { field: "status", headerName: "Status", flex: 1 , renderCell : (params) => {
      switch(params.row.status){
        case 'op_approval' : return "Release Approval Required"
        case "release_op_approval" : return "Release Approval Required"
        case 'cancel_approval' : return " Cancel business"
        case 'purchase_op_aapproval' : return "Payment Approval"
        case "release_approval" : return "Wait for Comp Appoval"
        case  "comp_approval" : return "Wait for Comp Appoval"
        default : break;
      }
    }},
    { field: "actions", headerName: "Actions", flex: 1, renderCell: (params) => {
       if(params.row.status === 'comp_approval') {
        return null;
       } else if(params.row.status === 'comp_approved'){
        return (
          <Box>
          <IconButton onClick={() => handleApprove(params.row)}>
            <CheckOutlined color="primary" />
          </IconButton>

          {/* <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton>  */}
        </Box>
        )
       } else if(params.row.status === 'op_approval'){
        return (
          <Box>
            <IconButton onClick={() => handleApprove(params.row)}>
              <CheckOutlined color="primary" />
            </IconButton>

            {/* <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton>  */}
          </Box>
        )
       }else if(params.row.status === "release_op_approval"){
        return (
          <Box>
            <IconButton onClick={() => handleApprove(params.row)}>
              <CheckOutlined color="primary" />
            </IconButton>

            {/* <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton>  */}
          </Box>
        )
       }else if(params.row.status === "purchase_op_aapproval"){
        return (
          <Box>
            <IconButton onClick={() => handleApprove(params.row)}>
              <CheckOutlined color="primary" />
            </IconButton>

            {/* <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton>  */}
          </Box>
        )
       }else if(params.row.status === "cancel_approval"){
        return (
          <Box>
            <IconButton onClick={() => handleApprove(params.row)}>
              <CheckOutlined color="primary" />
            </IconButton>
            {/* <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton>  */}
          </Box>
        )
       }
       else {
        return null;
       }
      },
    },
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchData();
    setTimeout(() => setLoading(false), 250);
  }, []);
  const fetchData = async () => {
    const statuses = ["op_approval", "release_op_approval", "purchase_op_approval", "cancel_approval", "comp_approval","purchase_op_aapproval","release_approval"];
    let allResults = [];
    for (const status of statuses) {
        const res = await getTasksByStatus({ status });
        allResults = [...allResults, ...res.data]; 
    }
    setRows(allResults);
    console.log(allResults);
};
  
// const handleCanel = (params) => {
//   setCancelDialogOpen(true)
//   setSelectedCancel(params)
//   console.log(params);
// }
//   const handleCancel = async (reason) => {
//     try{
//       const businessResponse = await updateBusiness(selectedCancel.businessId._id, {status: "op_disapproved", feedback :reason })
//       const taskResponse = await updateTask(selectedCancel._id, {status: "op_disapproved", feedback :reason })
//       const leadResponse = await updatedLeadApi(selectedCancel.leadId ,{status: "op_disapproved", feedback :reason } )
//       fetchData()
//     }catch(error){
//       enqueueSnackbar({message : error.response.data.message,variant: "error" });
//     }
//     setCancelDialogOpen(false);
//     console.log(reason);
//   };
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <Box
        sx={{
          ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
          p: 3,
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#f7f7f8",
          height : '90vh'
        }}
      >
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
          Business Approvals
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
      {/* <CancelLeadDialog  cancelDialogOpen={cancelDialogOpen} setCancelDialogOpen={setCancelDialogOpen} onSubmit={handleCancel}/> */}
      <CustomerView open={customerDialog} setOpen={setCustomerDialog} business={businessDetails} customer={customerData} ornaments={ornaments} />
      <Loader loading={loading}/>
    </SnackbarProvider>
  );
}