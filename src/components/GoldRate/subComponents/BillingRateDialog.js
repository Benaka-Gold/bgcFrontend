import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function BillingRate({ open, setOpen, onSubmit }) {
    const { control, handleSubmit, formState: { errors } } = useForm();
    
    const handleFormSubmit = (formData) => {
        onSubmit({ ...formData });
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Billing Rate</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                    <Controller
                        name="price"
                        control={control}
                        rules={{ required: "Price is required" }}
                        render={({ field }) => (
                            <TextField {...field} label="Price" variant="outlined" fullWidth margin="normal" type="number" error={!!errors.price} helperText={errors.price ? errors.price.message : ''} />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                    <Button type="submit" color="primary" variant="contained">Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
