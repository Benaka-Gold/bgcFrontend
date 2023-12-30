import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getLeads } from "../../../apis/leadsApi";
import Loader from "../../../components/Loader";
import { Typography, Box } from "@mui/material";
import { grey } from "@mui/material/colors";

export default function LeadsDashboard() {

    const [leads, setLeads] = React.useState([])
    const [loading, setLoading] = React.useState(true)

      
    const columns = [
        { field: 'name', headerName: 'Name' ,flex : 1,disableColumnMenu : true, sortable : false},
        { field: 'phoneNumber', headerName: 'Phone', disableColumnMenu : true, sortable : false,flex : 1 },
        { field: 'status', headerName: 'Status', disableColumnMenu : true, sortable : true,flex : 1},
        { field: 'feedback', headerName: "Feedback", disableColumnMenu : true, sortable : false,flex : 1},
        { field: 'grossWeight',headerName : 'Gross Weight',flex : 1, disableColumnMenu : true, sortable : true},
        { field: 'netWeight',headerName : 'Net Weight',flex : 1, disableColumnMenu : true, sortable : true},

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
        setLoading(true)
        fetchLeads()
        setTimeout(()=>setLoading(false),500)
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
        <Box sx={{ml: { sm: '240px', md: '240px', xs: 0, lg: '240px' },p:3}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 0,
                alignItems: 'center',
            }}>
            <Typography sx={{textAlign : 'left',fontFamily : 'Poppins, sans-serif'}} variant="h5">All Leads</Typography>
            </Box>
            <Box sx={{minHeight : '5vh',height : '5vh',mt : 1}}>
            <DataGrid
                columns={columns}
                rows={leads}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                sx={{ boxShadow: 4, backgroundColor: grey[50], fontFamily: 'Poppins, sans-serif', borderRadius: 2 }}
                pageSizeOptions={[5, 10, 15]}
                // checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row._id}
               
            />
            <Loader loading={loading}/>
            </Box>
        </Box>
    )
}