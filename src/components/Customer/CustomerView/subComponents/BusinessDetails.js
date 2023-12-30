import React, { useEffect, useState } from 'react'
import { Box, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { getFile } from '../../../../apis/fileUpload';
import { enqueueSnackbar } from "notistack";
import ModalImage from 'react-modal-image';
import { getBranchById } from '../../../../apis/branch';

function BusinessDetails({ business }) {
    console.log(business);
    const [releaseCopy, setReleaseCopy] = useState('')
    const [pledgeCopy, setPledgeCopy] = useState('')
    const [branch, setBranch] = useState('')

    useEffect(() => {
        fetchImageData();
        getBranchByID()
    }, [business.releaseCopy, business.pledgeCopy]);
    const fetchImageData = async () => {
        try {
            if(business.releaseCopy){
                const releaseResponse = await getFile(business.releaseCopy);
                setReleaseCopy(releaseResponse.data.data);
            }
            if(business.pledgeCopy){
                const pledgeResponse = await getFile(business.pledgeCopy);
                setPledgeCopy(pledgeResponse.data.data);
            }
            // if(business.n){
            //     const pledgeResponse = await getFile(business.pledgeCopy);
            //     setPledgeCopy(pledgeResponse.data.data);
            // }
          
        } catch (error) {
            enqueueSnackbar({ message: error.response.data.error, variant: 'error' });
        }
    };

    const getBranchByID = async () => {
        try {
            setBranch(business.branchId.branchName)
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
                        {business && business.releasingAmount ?
                        <>
                            <TableCell>Releasing Amount</TableCell>
                            <TableCell>{business.releasingAmount}</TableCell>
                        </> :""}
                            <TableCell>Branch</TableCell>
                            <TableCell>{branch}</TableCell>
                        </TableRow>
                        {business && business.pledgeCopy ? 
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
                        </TableRow> :""}
                    </TableBody>
                </Table>
            </Box>
        </>
    )
}

export default BusinessDetails
