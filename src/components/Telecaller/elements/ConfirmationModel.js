import * as React from 'react';
import { Box, Button } from '@mui/joy';
import Modal from '@mui/material/Modal';
import { ModalDialog } from '@mui/joy';
import Typography from '@mui/material/Typography';
import { assignLead } from '../../../apis/leadsApi';
import Loader from '../../Loader';
import { enqueueSnackbar, SnackbarProvider } from "notistack";



export default function ConfirmationModel({ selectedRows, leadsData, userId, fetchTeamById, newLeads ,fetchData}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([])
  const [loading, setLoading] = React.useState(false)



  const confirmAssign = async () => {
    setOpen(false);
    const selectedLeads = [];
    selectedRows.forEach(id => {
      leadsData.forEach((lead) => {
        if (lead._id === id) {
          selectedLeads.push(lead);
        }
      });
    });

    setSelected(selectedLeads);
    for (const lead of selectedLeads) {
      try {
        const res = await assignLead(lead._id, userId);
        setLoading(true)
        if (res.success) {
          setTimeout(() => {
            setLoading(false)
            
          }, 250)
          fetchTeamById()
          newLeads()
          fetchData()
        }
      } catch (error) {
        enqueueSnackbar({message :error.message,variant : 'error'})
      }
    }
  };


  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <React.Fragment>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)} disabled={selectedRows.length <= 0 ? true : false} sx={{ backgroundColor: "white" }}>
        Assign Leads
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog  aria-labelledby="nested-modal-title" aria-describedby="nested-modal-description"
          sx={(theme) => ({ [theme.breakpoints.only('xs')]: { top: 'unset', bottom: 0, left: 0, right: 0,  borderRadius: 0, transform: 'none', maxWidth: 'unset', }, })} >
          <Typography id="nested-modal-title" level="h2">
            Are you absolutely sure?
          </Typography>
          <Typography id="nested-modal-description">
          </Typography>
          <Box  sx={{ mt: 1, display: 'flex',  gap: 1, flexDirection: { xs: 'column', sm: 'row-reverse' },}} >
            <Button variant="solid" color="primary" onClick={confirmAssign}>
              Assign
            </Button>
            <Button variant="outlined" color="neutral" onClick={() => setOpen(false)} >
              Cancel
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      <Loader loading={loading} />
    </React.Fragment>
    </SnackbarProvider>
  );
}