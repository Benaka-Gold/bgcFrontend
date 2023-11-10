import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { getEmployees } from '../../../apis/employee';
import { AddOutlined, DeleteOutlineOutlined, UpdateOutlined } from '@mui/icons-material';
import EmployeeForm from '../../../components/Employee/EmployeeForm';
import { grey } from '@mui/material/colors';
import Loader from '../../../components/Loader';

const EmployeesList = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false)
    const [employee, setEmployeeData] = useState({})
    const [loading,setLoading] = React.useState(false)

    useEffect(() => {
        setLoading(true)
        fetchEmployees();
        setTimeout(()=>setLoading(false),500)
    }, []);


    const fetchEmployees = async () => {
        try {
            const response = await getEmployees(); // Adjust the endpoint as needed
            setRows(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id) => {
        console.log(id)
    }
    const handleSubmit = async () => {
        console.log(employee)
    }

    const columns = [
        { field: 'empCode', headerName: 'Emp Code', flex: 1 },
        { field: 'fullName', headerName: 'Full name', flex: 1, valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}` },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
        {
            field: 'action', headerName: "Actions", flex: 1, renderCell: params => {
                return <Box>
                    <IconButton color='primary' onClick={() => {
                        setOpen(true)
                        setEmployeeData(params.row)
                    }}><UpdateOutlined /></IconButton>
                    <IconButton sx={{ color: 'red' }} onClick={() => handleDelete(params.row._id)}><DeleteOutlineOutlined /></IconButton>
                </Box>
            }
        }
        // Add more columns as needed
    ];

    return (
        <Box sx={{ ml: { md: '240px', sm: '240px', xs: '0px', lg: '240px' }, p: 3, fontFamily: 'Poppins, sans-serif', backgroundColor: "#f7f7f8", height : '90vh' }}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                m: 1,
                mt: 0,
                alignItems: 'center',
            }}>
                <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontFamily: 'Poppins, sans-serif', textAlign: "left" }}>
                    Employee Management
                </Typography>
                <Button variant='contained' onClick={(e) => {
                    e.preventDefault();
                    setOpen(!open)
                    setEmployeeData(null)
                }}>
                    <AddOutlined />
                    Add
                </Button>
            </Box>
            <Box sx={{}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={row => row._id}
                    sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2,minHeight : '3vh' }}
                />
            </Box>

            <EmployeeForm open={open} employeeData={employee} onClose={() => { setOpen(!open) }} onSave={handleSubmit} />
      <Loader loading={loading}/>

        </Box>
    );
};

export default EmployeesList;
