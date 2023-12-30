import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { getFile } from '../../../../apis/fileUpload';
import Loader from '../../../Loader';
import { Player } from 'video-react';
import "/node_modules/video-react/dist/video-react.css";
import { enqueueSnackbar } from 'notistack';

export default function Verification({ customer,business }) {
    const [houseVerificationUrl, setHouseVerificationUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHouseVerification();
    }, [business.houseVerification]);

    const fetchHouseVerification = async () => {
        if (business.houseVerification) {
            setLoading(true);
            try {
                const res = await getFile(business.houseVerification);
                setHouseVerificationUrl(res.data.data);
            } catch (error) {
                enqueueSnackbar({message : error.response.data.error,variant : 'error'})
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
        <Box mt={3} p={2} sx={{ fontFamily: 'Poppins, sans-serif' , minHeight : '60vh'}}>
            {loading && <Loader />}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/* <InfoRow title="Verification Feedback:" value={business.verificationFeedback ? 'Verified' : 'Not Verified'} /> */}
                    <InfoRow title="Types of Verification:" value={business?.typesOfVerification.join(', ') || 'N/A'} />
                    {/* Display house verification video if available */}
                    {houseVerificationUrl && (
                        <InfoRow title={"House Verification Video"} value={
                            <Player  src={houseVerificationUrl} fluid={false} width={350} height={350}  />
                        }/>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
