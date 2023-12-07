// FundDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, FormLabel, TextField, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export default function FundDialog({ open, handleClose, onSubmit, initialData = {}, branches = [], executives = [] }) {
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: initialData
    });

    const fundType = watch("fundType");

    const handleForm = (data) => {
        console.log(data)
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData._id ? 'Update Fund' : 'Add a new Fund'}</DialogTitle>
            <form onSubmit={handleSubmit(handleForm)}>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <FormLabel>Fund Type</FormLabel>
                        <Controller
                            name="fundType"
                            control={control}
                            rules={{ required: 'Fund Type is required' }}
                            render={({ field }) => (
                                <Select {...field}>
                                    <MenuItem value="Branch">Branch</MenuItem>
                                    <MenuItem value="Executive">Executive</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.fundType && <p>{errors.fundType.message}</p>}
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <FormLabel>{fundType === 'Branch' ? 'Branch Name' : "Executive Name"}</FormLabel>
                        <Controller
                            name="relatedTo"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            render={({ field }) => (
                                <Select {...field}>
                                    {fundType === 'Branch' ? branches.map(b => <MenuItem key={b._id} value={"Branch"}>{b.branchName}</MenuItem>)
                                    : executives.map(e => <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>)}
                                </Select>
                            )}
                        />
                        {errors.relatedTo && <p>{errors.relatedTo.message}</p>}
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <FormLabel>Amount</FormLabel>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: 'Amount is required' }}
                            render={({ field }) => (
                                <TextField {...field} type="number" />
                            )}
                        />
                        {errors.amount && <p>{errors.amount.message}</p>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" variant="contained">Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}