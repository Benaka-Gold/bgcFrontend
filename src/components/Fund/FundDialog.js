import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, FormLabel, TextField, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export default function FundDialog({ open, handleClose, onSubmit, initialData = {}, branches = [], executives = [] }) {
    const { control, handleSubmit, watch,reset, formState: { errors } } = useForm({
        defaultValues: initialData
    });

    const fundType = watch("fundType");

    const handleForm = (data) => {
        let fundTypeName = '';
        if (data.fundType === 'Branch') {
            const branch = branches.find(b => b._id === data.relatedTo);
            fundTypeName = branch ? `${branch.branchName} Fund` : 'Branch Fund';
        } else if (data.fundType === 'Executive') {
            const executive = executives.find(e => e._id === data.relatedTo);
            fundTypeName = executive ? `${executive.name} Fund` : 'Executive Fund';
        }
        var output = {}
        initialData._id === undefined ?
        (output = {
            fundType: fundTypeName,
            relatedTo: data.relatedTo,
            amount : data.amount,
            onModel : data.fundType
        })
        :
        (output = {
            amount : data.amount            
        })
        onSubmit(output);
    }

    React.useEffect(()=>{
        reset(initialData)
    },[initialData])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{initialData._id  ? 'Update Fund' : 'Add a new Fund'}</DialogTitle>
            <form onSubmit={handleSubmit(handleForm)}>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <FormLabel>Fund Type</FormLabel>
                        <Controller
                            name="fundType"
                            control={control}
                            disabled={(initialData._id !== undefined)}
                            rules={ initialData._id=== undefined ? { required: 'Fund Type is required' } : {}}
                            defaultValue={''}
                            render={({ field }) => (
                                initialData._id === undefined ? 
                                (<Select {...field}  defaultValue={''}>
                                    <MenuItem value="Branch">Branch</MenuItem>
                                    <MenuItem value="Executive">Executive</MenuItem>
                                </Select>)
                                :
                                (<TextField {...field} />)
                            )}
                        />
                        {errors.fundType && <p>{errors.fundType.message}</p>}
                    </FormControl>
                    {initialData._id === undefined ? <FormControl fullWidth margin="normal">
                        <FormLabel>{fundType === 'Branch' ? 'Branch Name' : "Executive Name"}</FormLabel>
                        <Controller
                            name="relatedTo"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            defaultValue={''}
                            render={({ field }) => (
                                <Select {...field}  defaultValue={''}>
                                    {fundType === 'Branch' ? branches.map(b => <MenuItem key={b._id} value={b._id}>{b.branchName}</MenuItem>)
                                    : executives.map(e => <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>)}
                                </Select>
                            )}
                        />
                        {errors.relatedTo && <p>{errors.relatedTo.message}</p>}
                    </FormControl>
                    : null}
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
