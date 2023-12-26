import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { createGoldRate, getGoldRate, updateGoldRate,update24kRate } from "../../apis/goldRate";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import GoldRateDialog from "./subComponents/GoldRateDialog";
import Loader from "../Loader";
import BillingRate from "./subComponents/BillingRateDialog";

export default function GoldRate(){
    const [rows,setRows] = React.useState([])
    const [loading,setLoading] = React.useState(false)
    const [open,setOpen] = React.useState(false)
    const [data,setData] = React.useState({})
    const [billingOpen,setBillingOpen] = React.useState(false)

    const columns = [
        {field : "purityName",headerName : "Carat",flex : 1},
        {field : 'purity',headerName : "Purity %",flex : 1 },
        {field : "price",headerName : 'Price',flex : 1},
        {field : 'actions',headerName : "Actions", flex : 1,renderCell : (params)=>{
            return (<Box>
                <IconButton
                onClick={()=>{handleEdit(params.row)}}
                ><EditOutlined/></IconButton>
            </Box>
        )}}
    ]

    React.useEffect(()=>{
        setLoading(true)
        fetchData()
        setLoading(false)
    },[])
    
    const fetchData = async() => {
        try{
            const res = await getGoldRate();
            const arr = res.data.filter(rate => rate.purity !== 100);
            setRows(arr)
        } catch(error){
            enqueueSnackbar({message : "Error fetching data, please contact IT",variant : 'error'})
        }
    }

    const handleSubmit = async(formData) => {
        setLoading(true)
        setOpen(false)
        try {
            let res;
            if(formData.isUpdateMode) {
                res = await updateGoldRate(formData.isUpdateMode,{price : formData.price})
            }
            else {
                res = await createGoldRate(formData)
            }
            if(res.status === 200){
                enqueueSnackbar({message : "Gold Rate Updated Successfully",variant : "success"})
            }
        } catch (error) {
            enqueueSnackbar({message : error.response.data.message,variant : "error"})
        } finally {
            fetchData()
            setLoading(false)
        }
    }

    const handle24kSubmit = async(data) => {
        setLoading(true)
        try { 
            const res = await update24kRate({price : data.price})
            if(res.status === 200){
                enqueueSnackbar({message : 'Gold Rate Updated Successfully',variant : 'success'})
            }
         } catch(error) {
            enqueueSnackbar({message : error.response.data.message,variant : 'error'})
            }
        finally {
            await fetchData()
            setBillingOpen(false)
            setLoading(false)
        }
    }

    const handleEdit = async (data) => {
        setData(data)
        setOpen(true)
    }

    return(
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Box 
        sx={{
            ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
            p: 3,
            fontFamily: "Poppins, sans-serif",
            backgroundColor: "#f7f7f8",
            height: "90vh",
          }}>
            <Box sx={{display : 'flex',justifyContent : 'space-between'}}>
                <Typography
                sx={{ fontFamily: "Poppins, sans-serif", textAlign: "left" }}
                variant="h5"
                >
                Gold Rates
                </Typography>
                {localStorage.getItem('role') === 'admin' && 
                    <Button variant={"contained"} color="primary" onClick={()=>{
                        setData({})
                        setBillingOpen(true)
                    }} startIcon={<AddOutlined/>}>
                        Update Biling Price
                    </Button>}
            </Box>
            <Box  sx={{minHeight : '5vh'}}>
                <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id}
                sx={{ boxShadow: 4, fontFamily: "Poppins, sans-serif",}}
                disableRowSelectionOnClick
                onRowDoubleClick={(params)=>{handleEdit(params.row)}}
                />
            </Box>
            <Loader loading={loading} />
            <GoldRateDialog open={open} setOpen={setOpen} onSubmit={handleSubmit} data={data} />
            <BillingRate open={billingOpen} setOpen={setBillingOpen} onSubmit={handle24kSubmit} />
        </Box>
        </SnackbarProvider>
    )
}