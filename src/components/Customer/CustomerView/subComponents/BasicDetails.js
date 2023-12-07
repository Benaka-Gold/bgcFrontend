import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";

export default function BasicDetails({ customer }) {
    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const InfoRow = ({ title, value, isAddress }) => (
        <Box>
        <Box display="flex" justifyContent={"space-around"} width="100%" mb={1} mt={1}>
            <Typography sx={{ fontWeight: 'bold', width: '30%' }}>{title}</Typography>
            <Typography sx={{  wordBreak: isAddress ? 'break-word' : 'normal', width: '50%' }}>
                {value}
            </Typography>
        </Box>
        <Divider />
        </Box>
    );

    return (
        <Box mt={3} p={2} sx={{ fontFamily: 'Poppins, sans-serif' }}>
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
                    <InfoRow title="Current Residential Address:" value={customer.currentAddress} isAddress />
                    <InfoRow title="Office/Business Address:" value={customer.officeBusinessAddress} isAddress />
                    <InfoRow title="Residential Status:" value={customer.residentialStatus} />
                    <InfoRow title="Source of Ornament:" value={customer.sourceOfOrnaments} />
                    <InfoRow title="Details of Jewellery:" value={customer.detailsOfJewellery} />
                    <InfoRow title="Jewellery Bought From:" value={customer.jewelleryBoughtFrom} />
                    <InfoRow title="Date of Purchase / Pledged:" value={formatDate(customer.dateOfPurchaseOrPledge)} />
                </Grid>
            </Grid>
        </Box>
    );
}
