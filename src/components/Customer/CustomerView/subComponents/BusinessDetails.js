import React, { useEffect, useState } from 'react'
import { Box, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { getFile } from '../../../../apis/fileUpload';
import { enqueueSnackbar } from "notistack";
import ModalImage from 'react-modal-image';
import { getBranchById } from '../../../../apis/branch';

function BusinessDetails({ business }) {
    const [releaseCopy, setReleaseCopy] = useState('')
    const [pledgeCopy, setPledgeCopy] = useState('')
    const [branch, setBranch] = useState('')

    useEffect(() => {
        fetchImageData();
        getBranchByID()
    }, [business.releaseCopy, business.pledgeCopy]);
    const fetchImageData = async () => {
        try {
            const releaseResponse = await getFile(business.releaseCopy);
            const pledgeResponse = await getFile(business.pledgeCopy);
            setReleaseCopy(releaseResponse.data.data);
            setPledgeCopy(pledgeResponse.data.data);
        } catch (error) {
            enqueueSnackbar({ message: error.response.data.error, variant: 'error' });
        }
    };

    const getBranchByID = async () => {
        try {
            const response = await getBranchById(business.branchId)
            setBranch(response.branchName)
        } catch (error) {
            enqueueSnackbar({ message: error.message, variant: 'error' });
        }
    }
    return (
        <>
            <Box sx={{minHeight : '60vh' }}>
                <Table>

                    <TableBody>
                        <TableRow>
                            <TableCell>Net Weight</TableCell>
                            <TableCell>{business.netWeight}</TableCell>
                            <TableCell>Gross Weight</TableCell>
                            <TableCell>{business.grossWeight}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Releasing Amount</TableCell>
                            <TableCell>{business.releasingAmount}</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>{branch}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Pledge Copy</TableCell>
                            <TableCell>
                                <div style={{ width: '50px', maxWidth: '50px' }}>
                                    <ModalImage small={pledgeCopy} large={pledgeCopy} />
                                </div>
                            </TableCell>
                            <TableCell>Release Copy</TableCell>
                            <TableCell>
                                <div style={{ width: '50px', maxWidth: '50px' }}>
                                    <ModalImage small={releaseCopy} large={releaseCopy} />
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </>
    )
}

export default BusinessDetails
