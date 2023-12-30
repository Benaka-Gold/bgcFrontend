import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { getBusinesses } from "../../apis/business";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { grey } from "@mui/material/colors";
import Loader from "../Loader"
import { Status } from "../../utils/global";

export default function BusinessList () {
    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const columns = [
        {field : 'assignedTo',headerName : 'Telecaller',flex : 0.7,renderCell : (params) => params.row.leadId.assignedTo.name},
        {field : 'assignedToTele',headerName : 'Executive',flex : 0.7,renderCell : (params) => params.row.taskId.assignedTo.name},
        {field : 'customerName',headerName : 'Customer',flex : 0.7,renderCell : (params) => params.row.customerId.name},
        {field : 'grossWeight',headerName : "Gross Weight",flex : 0.5},
        {field : 'netWeight',headerName : 'Net Weight',flex : 0.5},
        {field : 'releaseAmount',headerName : "Release Amount",flex : 0.5},
        {field : 'status',headerName : "Status",flex : 1,renderCell : params => Status(params.row.status)},
        {field : 'feedback',headerName : "Feedbacl",flex : 1,render : params => params.row.feedback}
    ]

    React.useEffect(()=>{
        fetchData()
    },[])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getBusinesses()
            setRows(res.data)
        } catch(error) {
            enqueueSnackbar({message : error.response.data.message,variant : 'error'})
        } finally {
            setLoading(false)
        }
    }

    return(
        <SnackbarProvider>
        <Box sx={{ml: { sm: '240px', md: '240px', xs: 0, lg: '240px' },p:3}}>
            <Box >
                <Typography sx={{textAlign : 'left',fontFamily : 'Poppins, sans-serif'}} variant="h5">Business</Typography>
            </Box>
            <Box sx={{minHeight : '5vh',height : '5vh',mt : 1}}>
            <DataGrid
                columns={columns}
                rows={rows}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2 }}
                pageSizeOptions={[5, 10, 15]}
                disableRowSelectionOnClick
                getRowId={(row) => row._id}
            />
            </Box>
            <Loader loading={loading}/>
        </Box>
        </SnackbarProvider>
    )
}