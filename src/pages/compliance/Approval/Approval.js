import React from "react";
import { Box,IconButton, Typography, Slide } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getComplianceVerifyTaskData, getTasksByStatus, updateTask } from "../../../apis/task";
import { ArrowRightAltOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import Loader from "../../../components/Loader";
import ApprovalView from "../../../components/Compliance/ApprovalView"

export default function Approval() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false); 
  const [data,setData] = React.useState()
  const [visible,setVisible] = React.useState(false)
  const containerRef = React.useRef(null);
  const handleOpen = async (data) => {
    setLoading(true);
    try {
      const res = await getComplianceVerifyTaskData(data._id)
      setData(res.data)
      setVisible(true)
    } catch (error) {
      enqueueSnackbar({message : error.response.data.message,variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelection = async (params) => {
    setLoading(true)
    try{
      const res = await getComplianceVerifyTaskData(params.row._id)
      console.log(res.data)
    } catch(error) {
      enqueueSnackbar({message : error.response.data.message,variant : 'error'})
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { field: "customerId", headerName: "Customer", flex: 1, renderCell: (params) => params.row.customerId.name,},
    { field: "netWeight", headerName: "Net Weight", flex: 1, renderCell: (params) => params.row.businessId.netWeight, },
    { field: "grossWeight", headerName: "Gross Weight", flex: 1, renderCell: (params) => params.row.businessId.grossWeight },
    { field: "assignedTo", headerName: "Executive", flex: 1,renderCell: (params) => params.row.assignedTo.name, },
    { field: "status", headerName: "Status", flex: 1 , renderCell : (params) => {
      switch(params.row.status){
        case 'op_approval' : return "Approval Required"
        case 'cancel_approval' : return "Approval to cancel business"
        default : break;
      }
    }},
    { field: "actions", headerName: "Actions", flex: 1, renderCell: (params) => {
        return (
            <Box>
              <IconButton onClick={() => handleOpen(params.row)}>
                <ArrowRightAltOutlined color="primary" />
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
  }, [visible]);

  const fetchData = async () => {
    let res = await getTasksByStatus({status : "op_approved"});
    let arr = res.data;  
    setRows(arr);
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

      </Box>
      <Loader loading={loading}/>
    </SnackbarProvider>
  );
}