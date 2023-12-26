import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Button } from "@mui/material";
import { DeleteOutline, EditOutlined, AddOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Loader from "../../../components/Loader";
import FundDialog from "../../../components/Fund/FundDialog";
import { createFund, updateFund, deleteFund, getFunds } from "../../../apis/fund";
import { getUsersByRole } from "../../../apis/user";
import { getBranches } from "../../../apis/branch";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function FundList() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentFund, setCurrentFund] = useState({});
    const [data,setData] = useState({})

    const handleDialogOpen = (fund = {}) => {
        setCurrentFund(fund);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentFund({});
    };

    const handleSaveFund = async (fundData) => {
        try {
            setLoading(true);
            var message = ""
            if (currentFund && currentFund._id) {
                const response = await updateFund(currentFund._id, fundData);
                message = "Fund Updated Successfully";
            } else {
                const response = await createFund(fundData);
                    message = "Fund Created Successfully";
            }
            const updatedFunds = await getFunds();
            setRows(updatedFunds.data);
            enqueueSnackbar({message : message,variant : "success"})
        } catch (error) {
            enqueueSnackbar({message : error.message,variant : "error"})
        } finally {
            setLoading(false);
            handleDialogClose();
        }
    };

    const handleDeleteFund = async (id) => {
        try {
            setLoading(true);
            await deleteFund(id);
            const updatedFunds = await getFunds();
            setRows(updatedFunds.data);
            enqueueSnackbar({message : "Fund Deleted Successfully",variant : "success"})
        } catch (error) {
            enqueueSnackbar({message : error.message,variant : "error"})
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: "fundType", headerName: "Fund Type", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1 },
        {
            field: "actions", headerName: "Actions", flex: 1, renderCell: (params) => (
                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={() => handleDialogOpen(params.row)}>
                        <EditOutlined color={'action'} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFund(params.row._id)}>
                        <DeleteOutline color={'error'} />
                    </IconButton>
                </Box>
            )
        }
    ];

    useEffect(() => {
        async function fetchFunds() {
            try {
                setLoading(true);
                const res = await getFunds();
                setRows(res.data);
            } catch (error) {
                console.error("Error fetching funds:", error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchData() {
                setLoading(true);
                let res = await getUsersByRole('executive');;
                setData(prevData => ({...prevData, executive : res.data}))
                    res = await getBranches()
                setData(prevData => ({...prevData, branches : res.data}))
                setLoading(false)
        }

        fetchFunds();
        fetchData();
    }, []);

    return (
        <SnackbarProvider autoHideDuration={2000} maxSnack={3}>
        <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, p: 3, fontFamily: 'Poppins, sans-serif', backgroundColor: "#f7f7f8", height: '90vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontFamily: 'Poppins, sans-serif', textAlign: "left" }}>
                    Fund Management
                </Typography>
                <Button variant='contained' onClick={() => handleDialogOpen()}>
                    <AddOutlined />
                    Add
                </Button>
            </Box>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    autoHeight
                    disableRowSelectionOnClick
                    onRowDoubleClick={(params) => handleDialogOpen(params.row)}
                    initialState={{
                        pagination: {
                            pageSize: 5,
                        },
                    }}
                    getRowId={row => row._id}
                    sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2, minHeight: '3vh' }}
                />
            </Box>

            <FundDialog
                open={dialogOpen}
                handleClose={handleDialogClose}
                onSubmit={handleSaveFund}
                initialData={currentFund}
                branches={data?.branches}
                executives={data?.executive}
            />
            <Loader loading={loading} />
        </Box>
        </SnackbarProvider>
    );
}
