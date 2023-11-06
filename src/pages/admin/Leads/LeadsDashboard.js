import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getLeads } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { Typography, Box } from "@mui/material";

export default function LeadsDashboard() {

    const [leads, setLeads] = React.useState([])
    const [loading, setLoading] = React.useState(true)

      
    const columns = [
        { field: 'name', headerName: 'Name' ,flex : 1,disableColumnMenu : true, sortable : false},
        { field: 'phoneNumber', headerName: 'Phone', disableColumnMenu : true, sortable : false,flex : 1 },
        { field: 'status', headerName: 'Status', disableColumnMenu : true, sortable : true,flex : 1},
        { field: 'feedback', headerName: "Feedback", disableColumnMenu : true, sortable : false,flex : 1},
        {
            field: 'assignedTeamName', headerName: "Assigned Team",
            //  renderCell: (params) => {
                // return (<>{params.row.assignedTeam ? params.row.assignedTeam.name : ''}</>)}
                flex : 1, disableColumnMenu : false, sortable : false, filterable : true
        },
        {
            field: 'assignedToName', headerName: 'Assigned To',
            //  renderCell: (params) => {
            //     return <>{params.row.assignedTo ? params.row.assignedTo.name : ''}</>
            // }, 
            flex : 1, disableColumnMenu : false, sortable : false, filterable : true
        }
    ];

    React.useEffect(() => {
        fetchLeads()
        setLoading(false)
    }, [])

    const fetchLeads = async () => {
        const fleads = await getLeads()
        let leads = fleads.data.map(lead => ({
            ...lead,
            assignedTeamName : lead.assignedTeam ? lead.assignedTeam.name : '',
            assignedToName : lead.assignedTo ? lead.assignedTo.name : ''
        }))
        setLeads(leads)
    }
    return (
        <Box sx={{ml: { sm: '240px', md: '240px', xs: 0, lg: '240px' }}}>
            <Typography sx={{textAlign : 'left',p:2,fontFamily : 'Poppins, sans-serif'}} variant="h4">All Leads</Typography>
            <DataGrid
                columns={columns}
                rows={leads}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                sx={{ boxShadow: 4 }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                getRowId={(row) => row._id}
               
            />
            <Loader loading={loading}/>
        </Box>
    )
}