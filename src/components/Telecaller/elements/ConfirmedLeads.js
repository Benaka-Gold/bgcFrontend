import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { getLeadByUser } from '../../../apis/leadsApi'
import { getAssignedTasks } from '../../../apis/task';
import { DataGrid } from "@mui/x-data-grid";
import Loader from '../../Loader';


function ConfirmedLeads() {
  const [customerData, setCustomerData] = useState([])
  const [loading, setLoading] = useState(false)
  const myObjectSerializedRetrieved = localStorage.getItem("user");
  const userData = JSON.parse(myObjectSerializedRetrieved);

  async function leadsById() {
    let payload = {
      userId: userData._id,
    };
    let response = await getLeadByUser(payload);
    if(response.success){
      
      let filtered = response.data.filter((item) => {
        return item.status === "Confirmed" || item.status === "Assigned" || item.status === "pending" || item.status === "started";
      });
      return filtered;
    }
    return []; 
  }

  async function fetchTasks(filteredLeads) {
    const taskPromises = filteredLeads?.map((lead) => getAssignedTasks(lead.taskId));
    const taskResponses = await Promise.all(taskPromises);
    const taskData = taskResponses.map(response => response.data.data);
    setLoading(true)
      setTimeout(()=>{
        setCustomerData(taskData)
        setLoading(false)
      }, 250)
  }

  useEffect(() => {
    async function fetchData() {
      const filteredLeads = await leadsById(); 
      await fetchTasks(filteredLeads); 
    }
    fetchData();
  }, []);
  const columns = [
    { field: "cname", headerName: "Customer Name", flex: 1 ,renderCell : (params) => {return params.row.customerId.name}},
    { field: "name", headerName: "Executive ", flex: 1 ,renderCell : (params) => {return params.row.assignedTo.name}},
    { field: "status", headerName: "Status", flex: 1 }
  ]
  

  return (
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
        getRowId={(row) => row._id}
        sx={{ fontFamily: 'Poppins, sans-serif', boxShadow: "2px 2px 2px 2px rgb(222,226,230)", backgroundColor: "white", m:4 }}
      />
      </Box>
      <Loader loading={loading} />
     </Box>
  )
}

export default ConfirmedLeads
