import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";

export default function BankDetails({ customer , business}) {
    const InfoRow = ({ title, value }) => (
        <Box>

        <Box display="flex" justifyContent={"space-around"} width="100%" mb={1} mt={1}>
            <Typography sx={{ fontWeight: 'bold', width: '30%' }}>{title}</Typography>
            <Typography sx={{  width: '50%' }}>
                {value}
            </Typography>
        </Box>
        <Divider />
        </Box>
    );
    
    const [type,setType] = React.useState(false)
    React.useEffect(() => {
        if(business.transactionType === "cash"){
            setType(false)
        } else {
            setType(true)
        }
    },[business])

    return(
        <Box mt={3} p={2} sx={{ fontFamily: 'Poppins, sans-serif',minHeight : '60vh' }}>
            {type ? 
            <>
            <InfoRow title={"Bank Name : "} value={customer.bankDetails?.bankName}/>
            <InfoRow title={"Account Type : "} value={customer.bankDetails?.accountType}/>
            <InfoRow title={"Account Number : "} value={customer.bankDetails?.accountNumber}/>
            <InfoRow title={"Account Holder Name : "} value={customer.bankDetails?.accountHolderName}/>
            <InfoRow title={"IFSC/MICR : "} value={customer.bankDetails?.ifscMicr}/>
            </>
            : <Typography variant="h6">Type of Transaction : Cash</Typography>}
        </Box>
    )
}