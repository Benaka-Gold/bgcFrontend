import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { getFile } from '../../../../apis/fileUpload';
import Loader from '../../../Loader';

export default function Verification({ customer }) {
    const [houseVerificationUrl, setHouseVerificationUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHouseVerification();
    }, [customer.houseVerification]);

    const fetchHouseVerification = async () => {
        if (customer.houseVerification) {
            setLoading(true);
            try {
                const res = await getFile(customer.houseVerification);
                setHouseVerificationUrl(res.data.data);
            } catch (error) {
                console.error('Error fetching house verification video:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const InfoRow = ({ title, value, isAddress }) => (
        <Box>
            <Box display="flex" justifyContent={"space-around"} width="100%" mb={1} mt={1}>
                <Typography sx={{ fontWeight: 'bold', width: '30%' }}>{title}</Typography>
                <Typography sx={{ wordBreak: isAddress ? 'break-word' : 'normal', width: '50%' }}>
                    {value}
                </Typography>
            </Box>
            <Divider />
        </Box>
    );

    return (
        <Box mt={3} p={2} sx={{ fontFamily: 'Poppins, sans-serif' }}>
            {loading && <Loader />}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InfoRow title="Verification Feedback:" value={customer.verificationFeedback ? 'Verified' : 'Not Verified'} />
                    <InfoRow title="Types of Verification:" value={customer.typesOfVerification.join(', ') || 'N/A'} />
                    {/* Display house verification video if available */}
                    {houseVerificationUrl && (
                        <Box>
                            <Typography sx={{ fontWeight: 'bold' }}>House Verification Video:</Typography>
                            <video src={houseVerificationUrl} controls style={{ maxWidth: '100%', height: 'auto' }} />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
