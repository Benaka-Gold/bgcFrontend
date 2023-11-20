import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Divider, Fade, } from '@mui/material';
import Loader from '../../../components/Loader';
import { AddCircleOutline, FileUploadOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Modal } from '@mui/joy';
import LeadForm from '../../../components/Leads/LeadForm';
import Papa from 'papaparse';
import { getTeamByType } from '../../../apis/team';
import { createLead } from '../../../apis/leadsApi';

export default function CreateLeads() {
    const [rows, setRows] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const upload = React.useRef(null)
    const [isModalOpen, setIsModelOpen] = React.useState(false);
    const [isSubmitModelOpen, setIsSubmitModalOpen] = React.useState(false)
    const [teams, setTeams] = React.useState([])
    const [successfulLeads, setSuccessfulLeads] = React.useState(0);


    const handleModal = () => {
        setIsModelOpen(!isModalOpen);
    };

    const fetchTeams = async () => {
        const res = await getTeamByType("Telecaller")
        setTeams(prevTeams => [...res.data.data])
    }

    React.useEffect(() => {
        fetchTeams()
        setLoading(false)
    }, [])


    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
        { field: 'assignedTeam', headerName: 'Team', flex: 1 },
        {field : 'source', headerName : "Source",flex : 1},
        { field: 'weight', headerName: 'Weight', flex: 1 },
        { field: 'purity', headerName: 'Purity', flex: 1 },
    ]

    console.log(teams);

    const handleAddRow = (e) => {
        const newRow = { id: rows.length + 1, ...e };  
        console.log(newRow);
        setRows(prevRows => [...prevRows, newRow]);
        setIsModelOpen(false);
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 250)
    }

    const modalBody = (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: 2, width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography variant="h5">
                Add a new Lead
            </Typography>
            <Divider />
            <LeadForm onSubmit={handleAddRow} teams={teams} setTeams={setTeams} />
        </Box>
    );

    const handleSubmit = async () => {
        setIsSubmitModalOpen(true);
        let successCount = 0;
        let failedLeads = [];
    
        for (let lead of rows) {
          // Delete the id from the lead object
          const { id, ...leadWithoutId } = lead;    
          leadWithoutId.weight = Number(lead.weight)
          leadWithoutId.status = "New"
          try {
            const response = await createLead(leadWithoutId);
            if (response.success) {
              successCount++;
            } else {
              // If the response status is not 200, consider it as a failed submission
              failedLeads.push(lead);
            }
          } catch (error) {
            console.error("Error creating lead:", error.error);
            failedLeads.push(lead);
          }
          setSuccessfulLeads(successCount);
        }
        setRows(failedLeads); // Update rows with the leads that failed to submit
    
        // If there are any failed leads, alert the user
        if (failedLeads.length > 0) {
          alert('Some leads could not be submitted and are still in the table. Please review them before submitting again.');
        }
        // You can choose to close the modal or leave it open for the user to close
        setIsSubmitModalOpen(false);
      };

    const handleUploadClick = async (e) => {
        if (upload.current) {
            upload.current.click()
        }
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // The file's text will be printed here
                const csvData = reader.result;
                parseCSVData(csvData);
            };
            reader.readAsText(file);
        }
    }

    const parseCSVData = (csvData) => {
        setLoading(true)
        Papa.parse(csvData, {
            complete: (result) => {
                console.log('Parsed Result:', result);
                const parsedRows = result.data
                    .slice(1)
                    .filter(row => row.every(value => value))
                    .map((row, index) => {
                        const [name, phoneNumber, assignedTeamName,source] = row;
                        // Lookup the team ID by name
                        const assignedTeam = teams.find(team => team.name === assignedTeamName);
                        const assignedTeamId = assignedTeam ? assignedTeam._id : null;
                        return { id: index + 1, name, phoneNumber, assignedTeam: assignedTeamId,source }; // temporary id for testing
                    });
                setRows(parsedRows);
            },
            header: false,
        });
        setTimeout(() => { setLoading(false) }, 250)
    }

    return (
        <Box sx={{ ml: '240px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 2 }} gap={2}>
                <Button onClick={handleModal} variant='contained' color='primary'>
                    <AddCircleOutline />
                    <Typography style={{ color: '#efefef' }} >
                        Add a Lead
                    </Typography>
                </Button>
                <input type='file' ref={upload} onChange={handleFileUpload} accept="text/csv" style={{ display: 'none' }} />
                <Button onClick={handleUploadClick} variant='contained' color='inherit' sx={{ justifyItems: 'center' }}>
                    <FileUploadOutlined />
                    <Typography >
                        Upload Leads
                    </Typography>
                </Button>
            </Box>
            <Box sx={{height : '70vh'}}>
                <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                sx={{m : 1,boxShadow :4}}
            />
            </Box>
            

            <Loader loading={loading} />
            <Modal
                open={isModalOpen}
                onClose={handleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Fade in timeout={500} unmountOnExit >
                    {modalBody}
                </Fade>
            </Modal>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 3 }}>
                <Button variant='contained' color='primary' onClick={handleSubmit}>Submit Leads</Button>
            </Box>
            <Modal
                open={isSubmitModelOpen}
                onClose={() => setIsSubmitModalOpen(false)}
            >
                <Fade in timeout={{ enter: 500, exit: 500 }} unmountOnExit>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>

                        <CircularProgress color='primary' />
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            {`${successfulLeads} out of ${rows.length} leads created`}
                        </Typography>
                    </Box>
                </Fade>

            </Modal>
        </Box>
    )
}