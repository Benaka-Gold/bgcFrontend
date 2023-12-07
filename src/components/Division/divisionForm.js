import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

export default function DivisionForm({ open, onSubmit, division, setOpen }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    React.useEffect(() => {
        reset(division); // Reset form with division data when division changes
    }, [division, reset]);

    const handleFormSubmit = data => {
        onSubmit(data); // Submit the form data to the parent component
        setOpen(false)
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>{division._id ? 'Update Division' : 'Create New Division'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Division Name"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            {...register("divisionName", { required: "Division name is required" })}
                            error={!!errors.divisionName}
                            helperText={errors.divisionName?.message}
                        />
                        {/* Add more fields as needed, following the same pattern */}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">
                        {division._id ? 'Update' : 'Create'}
                    </Button>
                    <Button color="inherit" onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
