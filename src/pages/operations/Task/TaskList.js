import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import Loader from "../../../components/Loader";
import { getAllTasks, getTasksByDivision } from "../../../apis/task";
import { grey } from "@mui/material/colors";

export default function TaskList(){
    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    
    const columns = [
        {field : 'customerId',headerName : 'Customer Name',flex : 1,renderCell : (params) => params.row.customerId.name},
        {field : 'executive',headerName : "Executive",flex : 1,renderCell : params => params.row.assignedTo.name},
        {field : 'branch',headerName : 'Branch',flex : 1,renderCell : params => params.row.businessId.branchId.branchName},
        {field : 'goldType',headerName : "Business Type",flex : 1,renderCell : params => {
            if(params.row.businessId.goldType === 'release'){
                return "Release Pledge Gold"
            }else if(params.row.businessId.goldType === 'physical') {
                return "Physical Gold"
            }
        }},
        {field : 'grossWeight',headerName : 'Gross Weight',flex : 1,renderCell : params => params.row.businessId.grossWeight},
        {field : 'netWeight',headerName : 'Net Weight',flex : 1,renderCell : params => params.row.businessId.netWeight},
        {field : 'status',headerName : "Status",flex : 1},
    ]

    React.useEffect(()=>{
        fetchData()
    },[])

    const fetchData = async() => {
        setLoading(true)
        try {
            const role = localStorage.getItem('role')
            let res;
            switch (role) {
                case 'MD' : res = await getAllTasks()
                                  break;
                case 'admin' : res = await getAllTasks()
                               break;
                default : res = await getTasksByDivision()
                          break;
            }
            console.log(res.data.data)
            setRows(res.data.data)
        } catch(error) {
            enqueueSnackbar({message : "Error fetching tasks.",variant : "error"})
        } finally {
            setLoading(false)
        }
    }

    return(
        <SnackbarProvider>
            <Box 
             sx={{
                ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
                p: 3,
                fontFamily: "Poppins, sans-serif",
                backgroundColor: "#f7f7f8",
                height : '90vh'
            }}>
                <Box>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: grey[800],
                            fontFamily: "Poppins, sans-serif",
                            textAlign: "left"
                        }}>
                            Tasks
                    </Typography>
                </Box>
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
                />
            </Box>
            <Loader loading={loading}/>
        </SnackbarProvider>
    )
}