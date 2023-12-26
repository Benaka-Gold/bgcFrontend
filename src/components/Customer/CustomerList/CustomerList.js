import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getCustomerById, getCustomers } from "../../../apis/customer";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Box, Typography } from "@mui/material";
import Loader from "../../Loader";
import CustomerView from "../CustomerView/CustomerView";
import { grey } from "@mui/material/colors";

export default function CustomerList(){

    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(true)
    const [open,setOpen] = React.useState()
    const [customerData,setCustomerData] = React.useState({})

    const columns = [
        {field : 'name',headerName : "Name",flex : 1},
        {field : 'phoneNumber',headerName : "Phone Number",flex : 1},
    ]

    const fetchData = async() => {
        setLoading(true)
        try {
            const res = await getCustomers();
            setRows(res.data.data)
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message,variant : "error"})
        } finally {
            setLoading(false)
        }
    }

    const handleRowSelection = async(params) => {
        setLoading(true)
        try {
            const res = await getCustomerById(params.row._id)
            setCustomerData(res.data)
            console.log(res.data);
        } catch(error){
            enqueueSnackbar({message : error.response.data.message,variant : 'error'})
        }
        finally {
            setOpen(true)
            setLoading(false)
        }
    }

    React.useEffect(()=>{
        fetchData()
    },[])

    return(
        <SnackbarProvider>
        <Box sx={{ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },p: 3,fontFamily: "Poppins, sans-serif", backgroundColor: "#f7f7f8", height : '90vh' }}>
            <Box>
                <Typography variant="h5" gutterBottom
                sx={{
                    color: grey[800],
                    fontFamily: "Poppins, sans-serif",
                    textAlign: "left",
                }}
                >
                    Customers
                </Typography>
            </Box>
            <Box sx={{minHeight : '5vh'}}>
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
            <CustomerView customer={customerData} open={open} setOpen={setOpen} />
            <Loader loading={loading}/>
        </Box>
        </SnackbarProvider>
    )
}