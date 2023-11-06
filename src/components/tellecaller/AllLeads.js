import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ConfirmationModel from './confirmationModel';
import { getLeads, getTeamsById, freshLeads } from '../../apis/leadsApi';
import Loader from '../Loader';
import './leadtable.css'

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phoneNumber', headerName: 'Number', flex: 1 },
  { field: 'status', headerName: 'Status', flex: 1 },
];

export default function LeadTable() {
  const [userId, setUserId] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [leadsData, setLeadsdata] = React.useState([]);
  const [formattedData, setFormattedData] = React.useState([]);
  const [teleTeams, setTeleTeams] = React.useState([]);
  const items = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = React.useState(false)


  const fetchData = async () => {
    try {
      let newVar = await getLeads();
      setLeadsdata(newVar.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchTeamById = async () => {
    try {
      let newVar = await getTeamsById(items.teamId);
      setLoading(true)
      setTimeout(()=>{
        if(newVar.success){
          setTeleTeams(newVar.data);
        }else{
          alert("Something went wrong")
        }
        setLoading(false)
      },250)
    } catch (error) {
      console.log(error);
    }
  }

  const newLeads = async () => {
    const res = await freshLeads(items.teamId)
    setLeadsdata(res.data)
  }

  React.useEffect(() => {
    fetchData();
    fetchTeamById();
    newLeads()
  }, []);

  React.useEffect(() => {
    if (leadsData) {
      const data = leadsData.map(lead => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phoneNumber: lead.phoneNumber,
        status: lead.status,
      }));
      setFormattedData(data);
    }
  }, [leadsData]);

  const handleSelectedRows = (rows) => {
    setSelectedRows(rows);
  }

  const handleChange = (event) => {
    setUserId(event.target.value);
  };

  return (
    <Box sx={{ ml:{md: '240px', sm: '240px', xs: '0px', lg: '240px'}, p: 3 ,  fontFamily: 'Poppins, sans-serif', backgroundColor: "rgb(249,249,249)", height:"85vh" }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p:1 }} gap={2}>
        <FormControl sx={{ width: "100px" }} disabled={selectedRows.length <= 0 ? true : false} >
          <InputLabel id="demo-simple-select-label" sx={{ fontFamily: 'Poppins, sans-serif', backgroundColor:"white"}}>Team</InputLabel  >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={userId}
            label="user"
            onChange={handleChange}
            sx={{backgroundColor:"white"}}
          >
            {teleTeams && teleTeams.map((item) => (
              <MenuItem value={item._id} key={item._id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <ConfirmationModel selectedRows={selectedRows} userId={userId} leadsData={leadsData} setLeadsdata={setLeadsdata} fetchTeamById={fetchTeamById}  />
      </Box>
      <DataGrid
        rows={formattedData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectedRows}
        sx={{ fontFamily: 'Poppins, sans-serif', boxShadow: "2px 2px 2px 2px rgb(222,226,230)", backgroundColor:"white"}}
      />
      <Loader loading={loading} />
    </Box>
  );
}
