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
import { getBussiness, updateBusiness } from "../../../apis/business";
import CancelLeadDialog from "../../../components/Operations/CancelLeadDialog";
import { CancelOutlined } from "@mui/icons-material";
import { updatedLeadApi } from "../../../apis/leadsApi";


export default function ReleaseApproval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [customerData, setCustomerData] = React.useState({});
  const [customerDialog,setCustomerDialog] = React.useState(false)
  const [ornaments,setOrnaments] = React.useState()
  const [business, setBusiness] = React.useState()
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [selectedCancel, setSelectedCancel] = React.useState(null)
  const [status,setStatus] = React.useState('')
  const handleApprove = async (data) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'))
    if(data.status === "accounts_approval"){
    try {
      // Uncomment and implement your API call here
      const res = await updateTask(data._id,{...data,status : 'purchase_approved'})
      const bUpdate = await updateBusiness(data.businessId._id,{status : 'purchase_approved',releaseApprovedBy : user._id})
      enqueueSnackbar({message : "Approval successful!",  variant: "success" });
      await fetchData()
    } catch (error) {
      enqueueSnackbar({message : "Error during approval",  variant: "error" });
    } finally {
      setLoading(false);
    }
    }else if(data.status === "purchase_acc_approval"){
      try {
        // Uncomment and implement your API call here
        const res = await updateTask(data._id,{...data,status : 'purchase_acc_approved'})
        const bUpdate = await updateBusiness(data.businessId._id,{status : 'purchase_acc_approved',releaseApprovedBy : user._id})
        enqueueSnackbar({message : "Approval successful!",  variant: "success" });
        await fetchData()
      } catch (error) {
        enqueueSnackbar({message : "Error during approval",  variant: "error" });
      } finally {
        setLoading(false);
      }
    }else if(data.status === "purchase_op_aapproved"){
      try {
        // Uncomment and implement your API call here
        const res = await updateTask(data._id,{...data,status : 'purchase_payment_done'})
        const bUpdate = await updateBusiness(data.businessId._id,{status : 'purchase_payment_done',releaseApprovedBy : user._id})
        enqueueSnackbar({message : "Approval successful!",  variant: "success" });
        await fetchData()
      } catch (error) {
        enqueueSnackbar({message : "Error during approval",  variant: "error" });
      } finally {
        setLoading(false);
      }
    }else if(data.status === "release_op_approval"){
      try {
        // Uncomment and implement your API call here
        const res = await updateTask(data._id,{...data,status : "release_acc_approved"})
        const bUpdate = await updateBusiness(data.businessId._id,{status : "release_acc_approved",releaseApprovedBy : user._id})
        enqueueSnackbar({message : "Approval successful!",  variant: "success" });
        await fetchData()
      } catch (error) {
        enqueueSnackbar({message : "Error during approval",  variant: "error" });
      } finally {
        setLoading(false);
      }
    }else if(data.status === "purchase_op_aapproved"){
      try {
        // Uncomment and implement your API call here
        const res = await updateTask(data._id,{...data,status : "purchase_payment_done"})
        const bUpdate = await updateBusiness(data.businessId._id,{status : "purchase_payment_done",releaseApprovedBy : user._id})
        enqueueSnackbar({message : "Approval successful!",  variant: "success" });
        await fetchData()
      } catch (error) {
        enqueueSnackbar({message : "Error during approval",  variant: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRowSelection = async (params) => {
    if (["op_approval", "release_op_approval", "purchase_op_approval",].includes(params.row.status)) {
      return; 
    }
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
    // { field: "weight", headerName: "Weight", flex: 1, renderCell: (params) => params.row.weight},
    // { field: "purity", headerName: "Purity",flex: 1, renderCell: (params) => params.row.purity?.purityName, },
    {field : "releasingAmount",headerName : "Releasing Amount",flex : 1, renderCell : (params) => params.row.businessId.releasingAmount},
    {field : "description",headerName : "Description",flex : 1, renderCell : (params) => params.row.description},
    { field: "status", headerName: "Status", flex: 1 , renderCell : (params) => {
      switch(params.row.status){
        case "accounts_approval" : return "Payment Approval Required"
        case "purchase_acc_approval" : return "Release Approval Required"
        case "purchase_op_aapproved" : return "Payment Approval Required"
        case "purchase_op_aapproved" :return "Payment Approval Required"
        case "purchase_op_aapproval" : return "Wait for OP Approval"
        case "op_approval" : return "Wait for OP Approval"
        case "release_op_approval" : return "Wait for OP Approval"
        case "purchase_op_approval" : return "Wait for OP Approval"
        case "op_approval" : return "Wait for OP Approval"

                default : break;
      }
    }},
    { field: "actions",headerName: "Actions",flex: 1,  renderCell:
    (params) => {
       if(params.row.status === 'accounts_approval'){
       return (
         <Box>
         <IconButton onClick={() => handleApprove(params.row)}>
           <CheckOutlined color="primary" />
         </IconButton>

         <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton> 
       </Box>
       )
      }else if(params.row.status === "purchase_acc_approval"){
        return (
          <Box>
          <IconButton onClick={() => handleApprove(params.row)}>
            <CheckOutlined color="primary" />
          </IconButton>

          <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton> 
        </Box>
        )
      }else if(params.row.status === "purchase_op_aapproved"){
        return (
          <Box>
          <IconButton onClick={() => handleApprove(params.row)}>
            <CheckOutlined color="primary" />
          </IconButton>

          <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton> 
        </Box>
        )
      }else if(params.row.status === "purchase_op_aapproved"){
        return (
          <Box>
          <IconButton onClick={() => handleApprove(params.row)}>
            <CheckOutlined color="primary" />
          </IconButton>

          <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton> 
        </Box>
        )
      }
     }}
  ];
  React.useEffect(() => {
    setLoading(true);
    fetchData();
    setTimeout(() => setLoading(false), 250);
  }, []);

  const fetchData = async () => {
    try {
      const statuses = ["accounts_approval", "purchase_acc_approval", "purchase_op_approved","release_op_approval", "purchase_op_aapproved","purchase_op_aapproval","op_approval"];
      let allResults = [];
      for (const status of statuses) {
        const res = await getTasksByStatus({ status });
        allResults = [...allResults, ...res.data]; 
      }
      setRows(allResults);
      console.log(allResults);
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message, variant : 'error'});
    }
  };

  const handleCanel = (params) => {
    setCancelDialogOpen(true)
    setSelectedCancel(params)
    console.log(params);
    switch(params.status){
      case "accounts_approval" :  setStatus("purchase_acc_disapproved")
      break;
       case "purchase_acc_approval" : setStatus("purchase_acc_disapproved")
      break;
      case "purchase_op_aapproved" : setStatus("payment_acc_disapproved")
      break;
      default : setStatus(params.row.status)
      break;
    }
  }

    const handleCancel = async (reason) => {
      try{
        const businessResponse = await updateBusiness(selectedCancel.businessId._id, {status: status, feedback :reason })
        const taskResponse = await updateTask(selectedCancel._id, {status: status, feedback :reason })
        const leadResponse = await updatedLeadApi(selectedCancel.leadId ,{status: status, feedback :reason } )
        fetchData()
      }catch(error){
        enqueueSnackbar({message : error.response.data.message,variant: "error" });
      }
      setCancelDialogOpen(false);
      console.log(reason);
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
           Approvals
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
      <CustomerView open={customerDialog} setOpen={setCustomerDialog} customer={customerData} ornaments={ornaments} business={business} />
      <CancelLeadDialog  cancelDialogOpen={cancelDialogOpen} setCancelDialogOpen={setCancelDialogOpen} onSubmit={handleCancel}/>
      <Loader loading={loading}/>
    </SnackbarProvider>
  );
}
