import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { customerOtpVerify } from '../../../../../apis/customer';
import { SnackbarProvider, enqueueSnackbar  } from "notistack";


const OtpVerify = ({ open, setDialogOpen, phoneNumber,setOtpVerified ,setLoading}) => {
    const [otp, setOtp] = useState('');

    const handleOtpChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, ''); 
        setOtp(numericValue);
    };

    const handleSubmit = async() => {
        setLoading(true)
        const payload ={
            phoneNumber : phoneNumber && phoneNumber,
            otp:otp
        }
        console.log(payload);
        try {
            const response = await customerOtpVerify(payload)
            console.log(response);
            if (response.status === 200) {
                setTimeout(()=>{
                    setDialogOpen(false)
                    enqueueSnackbar({message:"Verified", variant:'success'})
                    setOtpVerified(response.data)
                    setLoading(false)
                }, 250)
            }
        } catch (error) {
            setOtpVerified(false)
            enqueueSnackbar({message:error.message, variant:'error'})
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={() => setDialogOpen(false)}
            sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 'none' , m:1}, opacity:.9 }} 
        >
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogContent sx={{p:1}}>
                <MuiOtpInput
                    length={6}
                    name="otp"
                    value={otp}
                    onChange={handleOtpChange}
                    sx={{
                         minWidth: "100%", 
                        '& input': {
                            height: '30px', 
                        },
                        gap: '10px', 
                        margin:'auto'
                    }}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button disabled={otp.length !==6} onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OtpVerify;
