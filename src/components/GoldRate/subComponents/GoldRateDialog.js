import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function GoldRateDialog({ data, open, setOpen, onSubmit }) {
    const { control, handleSubmit, reset, formState: { errors }, watch,getValues,setValue } = useForm();

    // Determine whether we are adding or updating
    const isUpdateMode = data && data._id;
    const purityName = watch('purityName')

    useEffect(()=>{
        calcPurity();
    },[purityName])

    const calcPurity = () => {
        const purity = getValues('purityName')
        switch(purity){
            case "22KT (916 HM)" : setValue('purity',90)
                                    return;
            case "21KT (916 KDM)" : setValue('purity',85)
                                    return;
            case "20KT (KDM)" : setValue('purity',80)
                                    return;
            case "19KT (22CT)" : setValue('purity',73)
                                    return;
            case "18KT (29/22)" : setValue('purity',70)
                                    return;
            case "17KT" : setValue('purity',62)
                                    return;
            default : setValue('purity',0)
        }
    }

    // Reset form when dialog closes or when data changes
    useEffect(() => {
        if (open) {
            reset({
                purity: data?.purity || '',
                price: data?.price || '',
                purityName : data?.purityName || ''
            });
        } else {
            reset();
        }
    }, [data, open, reset]);

    const handleFormSubmit = (formData) => {
        onSubmit({ ...formData, isUpdateMode });
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isUpdateMode ? 'Update Gold Rate' : 'Add Gold Rate'}</DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent>
                        <Controller
                            name="purity"
                            disabled
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} inputMode={"numeric"} label="Purity %" variant="outlined" fullWidth margin="normal"  />
                            )}
                        />
                         <Controller
                            name="purityName"
                            control={control}
                            disabled={isUpdateMode}
                            render={({ field }) => (
                                <Select fullWidth {...field} defaultValue={''}>
                                    <MenuItem value="22KT (916 HM)">22KT (916 HM)</MenuItem>
                                    <MenuItem value="21KT (916 KDM)">21KT (916 KDM)</MenuItem>
                                    <MenuItem value="20KT (KDM)">20KT (KDM)</MenuItem>
                                    <MenuItem value="19KT (22CT)">19KT (22CT)</MenuItem>
                                    <MenuItem value="18KT (29/22)">18KT (29/22)</MenuItem>
                                    <MenuItem value="17KT">17KT</MenuItem>
                                </Select>
                            )}
                        />
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
                    <Button type="submit" color="primary" variant="contained">{isUpdateMode ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}


// export default function GoldRateDialog({ open, setOpen, onSubmit }) {
//     const { control, handleSubmit, formState: { errors } } = useForm();
    
//     const handleFormSubmit = (formData) => {
//         onSubmit({ ...formData });
//         setOpen(false);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <Dialog open={open} onClose={handleClose}>
//             <DialogTitle>Update Billing Rate</DialogTitle>
//             <form onSubmit={handleSubmit(handleFormSubmit)}>
//                 <DialogContent>
//                     <Controller
//                         name="price"
//                         control={control}
//                         rules={{ required: "Price is required" }}
//                         render={({ field }) => (
//                             <TextField {...field} label="Price" variant="outlined" fullWidth margin="normal" type="number" error={!!errors.price} helperText={errors.price ? errors.price.message : ''} />
//                         )}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">Close</Button>
//                     <Button type="submit" color="primary" variant="contained">Update</Button>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// }
