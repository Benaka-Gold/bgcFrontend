import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { getFile } from "../../../../apis/fileUpload";
import ModalImage from "react-modal-image";
import { enqueueSnackbar } from "notistack";

export default function BasicDetails({ customer }) {
    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [customerImage,setCustomerImage] = React.useState('')

    React.useEffect(()=>{
        getCustomerImage()
    },[customer])

    const getCustomerImage = async ()=>{
        try {
            const res = await getFile(customer.customerImage)
            setCustomerImage(res.data.data)
        }
        catch (error) { 
            enqueueSnackbar({message : "Error fetching customer image",variant : 'error'})
        }
    }

    const InfoRow = ({ title, value, isAddress,isImage }) => (
        <Box >
        <Box display="flex" justifyContent={"space-around"} width="100%" mb={1} mt={1} sx={isImage ? {height : 40} : {}}>
            <Typography sx={{ fontWeight: 'bold', width: '30%' }}>{title}</Typography>
            {isImage ? 
                <Box sx={{width : '50%'}}>
                    <div  style={{ width: 30, height: 30 }}>
                    <ModalImage small={value} large={value}/>
                    </div>
                </Box>
            :
            <Typography sx={{  wordBreak: isAddress ? 'break-word' : 'normal', width: '50%' }}>
                {value}
            </Typography>}
                
        </Box>
        <Divider />
        </Box>
    );

    return (
        <Box mt={3} p={2} sx={{ fontFamily: 'Poppins, sans-serif',minHeight : '60vh'}}>
            <Grid container spacing={2}>
                {/* Column 1 */}
                <Grid item xs={6}>
                    <InfoRow title="Name:" value={customer.name} />
                    <InfoRow title="Mobile Number:" value={customer.phoneNumber} />
                    <InfoRow title="Alternate Mobile:" value={customer.altPhone} />
                    <InfoRow title="Email:" value={customer.email} />
                    <InfoRow title="Gender:" value={customer.gender} />
                    <InfoRow title="Date of Birth:" value={formatDate(customer.dateOfBirth)} />
                    <InfoRow title="Employment Status:" value={customer.employmentStatus} />
                    <InfoRow title="Organization Status:" value={customer.organizationStatus} />
                    <InfoRow title="Annual Income:" value={customer.annualIncome} />
                    <InfoRow title="Marital Status:" value={customer.maritalStatus} />
                </Grid>

                {/* Column 2 */}
                <Grid item xs={6}>
                    <InfoRow title= "Customer Photo"  value={customerImage} isImage={true}/>
                    <InfoRow title="Current Residential Address:" value={customer.currentAddress} isAddress />
                    <InfoRow title="Office/Business Address:" value={customer.officeBusinessAddress} isAddress />
                    <InfoRow title="Residential Status:" value={customer.residentialStatus} />
                    <InfoRow title="Source of Ornament:" value={customer.sourceOfOrnaments} />
                    <InfoRow title="Jewellery Bought From:" value={customer.jewelleryDetails} />
                    <InfoRow title="Date of Purchase / Pledged:" value={formatDate(customer.dateOfPurchaseOrPledge)} />
                </Grid>
            </Grid>
        </Box>
    );
}
