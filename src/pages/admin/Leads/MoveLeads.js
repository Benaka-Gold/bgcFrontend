import {  CheckOutlined, DeleteOutline } from "@mui/icons-material";
import React from "react";
import { getMoveLeads, updatedLeadApi } from "../../../apis/leadsApi";
import { DataGrid } from "@mui/x-data-grid";
import { Box,Button } from "@mui/material";
import Loader from "../../../components/Loader";


export default function MoveLeads(){
    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const columns=[
        {field : 'name',headerName : "Name",flex : 1},
        {field : 'phoneNumber',headerName : "Phone Number",flex : 1},
        {field : 'assignedTeam',headerName : "Current Team",flex : 1,renderCell : (params)=> params.row.assignedTeam.name},
        {field : 'moveTo',headerName : "Move to Team",flex : 1,renderCell : (params) => params.row.moveTo.name},
        {field: 'action',headerName : "Action" , flex : 1,renderCell: (params) => {
            return <Box gap={2}>
                <Button variant="contained" onClick={()=>{handleApproved(params.row)}}><CheckOutlined/></Button>
                <Button variant="inherit"><DeleteOutline/></Button>
            </Box>
        }}
    ]
    React.useEffect(()=>{
        setLoading(true)
        fetchData();
        setTimeout(()=>{setLoading(false)},250)
    },[])

    const fetchData = async() => {
        const res = await getMoveLeads();
        if(res.status === 200){
            setRows(res.data.data)
        }
    }   

    const handleApproved = async (data) => {
        const updatedLead = {
            assignedTeam : data.moveTo._id,
            moveLead : false
        }
        // console.log({'_id' : data._id,updatedLead})
        setLoading(true)
        const res = await updatedLeadApi(data._id,updatedLead)
        if(res.status === 200){
            alert("Lead moved successfully")
            await fetchData()
        }
        else {
            alert(res.data.error)
            await fetchData()
        }
        setLoading(false)
    }

    return(
        <Box sx={{ml:'240px',p:2}}>
            <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row)=>row._id}
            sx={{minHeight : '240px', boxShadow : 3}}
            />
        <Loader loading={loading}/>
        </Box>

    )
}