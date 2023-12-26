import React, {useEffect, useState} from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getBranches } from '../../../../../apis/branch'
import { updateBusiness } from '../../../../../apis/business';
import { enqueueSnackbar, SnackbarProvider } from "notistack";

function UpdateBranchDialog({ open, setDialogOpen, businessId, businessData, handleStart}) {
    const [branchesData, setBranchesData] = useState([])
    const [selectedBranch, setSelectedBranch] = useState('');

    const fetchBranches =async ()=>{
        let response = await getBranches()
        setBranchesData(response.data)
      }
    useEffect(()=>{
      fetchBranches()
    },[])

    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
      };
    
      const handleSubmit =async () => {
        setDialogOpen(false)
       const updatedBusiness = {...businessData, branchId:selectedBranch}
        try {
          let response = await updateBusiness(businessId, updatedBusiness)
          if (response.data) {
            handleStart()
          }
        } catch (error) {
          enqueueSnackbar({message : error.message ,variant : 'error'})
        }
      };
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <Dialog
        open={open}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '70%', md: '50%' }, 
            height: 'auto', 
            maxWidth: 'none', 
            m:1
          }
        }}
      >
      <DialogTitle sx={{mb:2}}>Select a Branch</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id="branch-select-label">Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            value={selectedBranch}
            label="Branch"
            onChange={handleBranchChange}
          >
            {branchesData && branchesData.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>{branch.branchName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=> setDialogOpen(false)}>Cancel</Button>
        <Button disabled={!selectedBranch} onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
    </SnackbarProvider>
  )
}

export default UpdateBranchDialog
