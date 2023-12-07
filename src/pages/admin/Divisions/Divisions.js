import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline, EditOutlined, Add } from "@mui/icons-material";
import Loader from "../../../components/Loader";
import { createDivision, updateDivision, getAllDivision, deleteDivision } from "../../../apis/divisions";
import DivisionForm from "../../../components/Division/divisionForm";
import { grey } from "@mui/material/colors";

export default function Divisions() {
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [dialog, setDialog] = React.useState(false);
    const [division, setDivision] = React.useState({});

    const handleDelete = async (data) => {
        setLoading(true);
        try {

            const res = await deleteDivision(data._id);
            if (res.status === 200) {
                alert("Deleted Successfully");
                fetchData(); // Refresh the list after deletion
            } else {
                alert(res.data);
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = (divisionData = {}) => {
        setDivision(divisionData);
        setDialog(true);
    };

    const handleFormSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            if (data._id) {
                response = await updateDivision(data._id,data);
            } else {
                response = await createDivision(data);
            }
            if (response.status === 200) {
                alert(`Division ${data._id ? 'Updated' : 'Created'} Successfully`);
            } else {
                alert(response.statusText);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            fetchData();
            setLoading(false);
        }
    };

    const columns = [
        { field: 'divisionName', headerName: 'Division Name', flex: 1 },
        {
            field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => {
                return (
                    <Box>
                        <IconButton onClick={() => {
                            setDivision(null)
                            handleDialogOpen(params.row)
                        }}>
                            <EditOutlined color="primary"/>
                        </IconButton>
                        <IconButton onClick={async () => await handleDelete(params.row)}>
                            <DeleteOutline htmlColor="red"/>
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    React.useEffect(() => {
        setLoading(true);
        fetchData();
        setTimeout(() => { setLoading(false) }, 250);
    }, []);

    const fetchData = async () => {
        try {
            const res = await getAllDivision();
            setRows(res.data);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, p: 3, fontFamily: 'Poppins, sans-serif', backgroundColor: "#f7f7f8", height : '90vh' }}>
            <Box sx={{display : 'flex',justifyContent : 'space-between',mb : 1}}>
                <Typography variant="h5">Divisions</Typography>
                <Button onClick={() => handleDialogOpen()} variant="contained" color="primary" startIcon={<Add />}>
                    Add Division
                </Button>
            </Box>
            <Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    pageSizeOptions={[5,10]}
                    initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 5,
                          },
                        },
                      }}
                    getRowId={row => row._id}
                    sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2,minHeight : '3vh' }}
                />
            </Box>
            <Loader loading={loading} />
            <DivisionForm open={dialog} onSubmit={handleFormSubmit} division={division} setOpen={setDialog} />
        </Box>
    );
}
