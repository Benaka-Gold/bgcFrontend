import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { getLeadByUser } from '../../../apis/leadsApi'
import { getAssignedTasks } from '../../../apis/task';
import { DataGrid } from "@mui/x-data-grid";
import Loader from '../../Loader';
import { enqueueSnackbar, SnackbarProvider } from "notistack";



function ConfirmedLeads() {
  const [customerData, setCustomerData] = useState([])
  const [loading, setLoading] = useState(false)
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);

  async function leadsById() {
    let payload = {
      userId: userData._id,
    };
    try{
    let response = await getLeadByUser(payload);
    console.log(response);
    if(response.success){
      let filtered = response.data.filter((item) => {
        return item.status === "Confirmed" || item.status === "Assigned" || item.status === "pending" || item.status === "started";
      });
      return filtered;
    }
    return []; 
  }catch(error){
    enqueueSnackbar({message : error.message ,variant : 'error'})
  }
  }

  async function fetchTasks(filteredLeads) {
    try {
      if (!filteredLeads) {
        return;
      }
      const tasksToFetch = filteredLeads.filter((lead) => lead.taskId !== null);
      if (tasksToFetch.length === 0) {
        return;
      }
  
      const taskPromises = tasksToFetch.map((lead) => getAssignedTasks(lead.taskId));
      const taskResponses = await Promise.all(taskPromises);
      const taskData = taskResponses
        .map((response) => (response && response.data ? response.data.data : null))
        .filter((item) => item !== null);
      setLoading(true);
      setTimeout(() => {
        setCustomerData(taskData);
        setLoading(false);
      }, 250);
    } catch (error) {
      enqueueSnackbar({ message: error.message, variant: 'error' });
    }
  }
  

  useEffect(() => {
    async function fetchData() {
      const filteredLeads = await leadsById(); 
      console.log(filteredLeads);
      await fetchTasks(filteredLeads); 
    }
    fetchData();
  }, []);
  const columns = [
    { field: "cname", headerName: "Customer Name", flex: 1 ,renderCell : (params) => {return params.row.customerId.name}},
    { field: "name", headerName: "Assigned To ", flex: 1 ,renderCell : (params) => {return params.row.assignedTo.name}},
    { field: "status", headerName: "Status", flex: 1 }
  ]

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px', display: "flex", flexDirection: "column" }, height: "92vh", p: -1, backgroundColor: "#f7f7f8" }}>
        <Typography
        variant="h6"
        sx={{display: "flex", flexDirection: "row", ml:5,fontSize: "25px", mt:2 }}>
        Confirmed Leads
      </Typography>
         <Box>
        <DataGrid
      columns={columns}
      rows={customerData}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row ? row._id : undefined}
        sx={{ fontFamily: 'Poppins, sans-serif', boxShadow: "2px 2px 2px 2px rgb(222,226,230)", backgroundColor: "white", m:4 }}
      />
      </Box>
      <Loader loading={loading} />
     </Box>
     </SnackbarProvider>
  )
}

export default ConfirmedLeads
