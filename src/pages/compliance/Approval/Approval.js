import React from "react";
import { Box,IconButton, Typography, Slide } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getComplianceVerifyTaskData, getTasksByStatus, updateTask } from "../../../apis/task";
import { ArrowRightAltOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import Loader from "../../../components/Loader";
// import CancelIcon from '@mui/icons-material/Cancel';
import { CancelOutlined } from "@mui/icons-material";
import ApprovalView from "../../../components/Compliance/ApprovalView"
import CancelLeadDialog from "../../../components/Operations/CancelLeadDialog";
import { updateBusiness } from "../../../apis/business";
import { updatedLeadApi } from "../../../apis/leadsApi";
export default function Approval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false); 
  const [data,setData] = React.useState()
  const [visible,setVisible] = React.useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [selectedCancel, setSelectedCancel] = React.useState(null)
  const containerRef = React.useRef(null);

  const handleOpen = async (data) => {
    setLoading(true);
    try {
      const res = await getComplianceVerifyTaskData(data._id)
      setData(res.data)
      console.log(res.data);
      setVisible(true)
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant: "error" });
    } finally {
      setLoading(false);
    }
  };

 

  const columns = [
    // { field: "grossWeight", headerName: "Gross Weight", flex: 1, renderCell: (params) => params.row.businessId.grossWeight },
    // { field: "netWeight", headerName: "Net Weight", flex: 1, renderCell: (params) => params.row.businessId.netWeight, },
    { field: "assignedTo", headerName: "Executive", flex: 1,renderCell: (params) => params.row.assignedTo.name, },
    { field: "customerId", headerName: "Customer", flex: 1, renderCell: (params) => params.row.customerId.name,},
    { field: "description", headerName: "Description", flex: 1,renderCell: (params) => params.row.description, },
    // { field: "status", headerName: "Status", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 , renderCell : (params) => {
      switch(params.row.status){
        case 'release_approval' : return "Release Approval Required"
        case 'comp_approval' : return "Purchase Approval Required"
        case 'purchase_op_aapproval' : return "Purchased Approval Required"
        // case 'cancel_approval' : return "Approval to cancel business"
        // case 'comp_approval' : return "Waiting for Compliance Approval"
        default : break;
      }
    }},
    { field: "actions", headerName: "Actions", flex: 1, renderCell: (params) => {
        return (
            <Box sx={{gap:2}}>
              <IconButton onClick={() => handleOpen(params.row)}>
                <ArrowRightAltOutlined color="primary" />
              </IconButton>

              <IconButton onClick={()=> handleCanel(params.row)}> 
                <CancelOutlined color="error"/>
              </IconButton> 
            </Box>
        )}},
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchData();
    setTimeout(() => setLoading(false), 250);
  }, [visible]);

  const fetchData = async () => {
    let res = await getTasksByStatus({status : "comp_approval"});
    let res1 = await getTasksByStatus({status : "release_approval"});
    let mergedArray = [...res.data, ...res1.data];  
    setRows(mergedArray);
};
  const handleCanel = (params) => {
    setCancelDialogOpen(true)
    setSelectedCancel(params)
    console.log(params);
  }
const handleCancel = async(reason) => {
  try{
    const businessResponse = await updateBusiness(selectedCancel.businessId._id, {status: "comp_disapproved", feedback :reason })
    const taskResponse = await updateTask(selectedCancel._id, {status: "comp_disapproved", feedback :reason })
    const leadResponse = await updatedLeadApi(selectedCancel.leadId ,{status: "comp_disapproved", feedback :reason } )
    fetchData()
  }catch(error){
    enqueueSnackbar({message : error.response.data.message,variant: "error" });
  }
  setCancelDialogOpen(false);
  console.log(reason);
};
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <Box 
      sx={{
          ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
          p: 3,
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#f7f7f8",
          height : '90vh'}}>
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
              textAlign: "left",}}>
            Compliance Approvals
          </Typography>
        </Box>
            <Box ref={containerRef} overflow={'hidden'} p={1}>
              <Slide in={!visible} direction={"left"}
              container={containerRef.current} mountOnEnter unmountOnExit style={{transitionDelay : 150}}>
                <Box 
                  sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2,minHeight : '3vh' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    sx={{fontFamily: 'Poppins, sans-serif'}}
                    pageSizeOptions={[5, 10, 15]}
                    getRowId={(row) => row._id}
                    disableRowSelectionOnClick
                    onRowDoubleClick={(params)=>handleOpen(params.row)}
                  />
                </Box>
                </Slide>
                <Slide in={visible} direction="left" 
                container={containerRef.current} mountOnEnter unmountOnExit style={{ transitionDelay : 150}}>
                  <Box>
                  <ApprovalView data={data} setVisible={setVisible}/>
                  </Box>
                </Slide>
            </Box>
            <CancelLeadDialog  cancelDialogOpen={cancelDialogOpen} setCancelDialogOpen={setCancelDialogOpen} onSubmit={handleCancel}/>
      </Box>
      <Loader loading={loading}/>
    </SnackbarProvider>
  );
}