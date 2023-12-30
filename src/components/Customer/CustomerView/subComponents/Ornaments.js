import React, { useEffect, useState } from 'react';
import { getFile } from '../../../../apis/fileUpload';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ModalImage from "react-modal-image";
import { enqueueSnackbar } from 'notistack';

export default function Ornaments({ ornaments }) {
    console.log(ornaments);
    const [display, setDisplay] = useState(false)
    useEffect(()=>{
       if(ornaments.length > 0){
        setDisplay(true)
       }else setDisplay(false)
    }, [ornaments])
    const [rows, setRows] = useState([]);
    const fetchImages = async () => {
        try {
            const updatedRows = await Promise.all(ornaments.map(async (ornament) => {
            const res = await getFile(ornament.image);
            return { ...ornament, imageUrl: res.data.data };
            }));
            setRows(updatedRows);
        } catch(error) {
            enqueueSnackbar({message : error.response.data.error,variant : 'error'})
        }

    };

    useEffect(() => {
        fetchImages();
    }, [ornaments]);

    const totalNetWeight = rows.reduce((sum, row) => sum + row.netWeight, 0);
    const totalGrossWeight = rows.reduce((sum, row) => sum + row.grossWeight, 0);
    const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);



    return (
        <TableContainer sx={{ fontFamily: 'Poppins, sans-serif',height : '60vh',minHeight : '60vh',mt : 3}}>
            {display ? 
            <Table stickyHeader sx={{ minWidth: 700, marginTop : 2 }} aria-label="spanning table">
                <TableHead >
                    <TableRow >
                        <TableCell  sx={{fontWeight : 'bold'}}>Ornament Type</TableCell>
                        <TableCell  sx={{fontWeight : 'bold'}}>Ornament Image</TableCell>
                        <TableCell align="right"  sx={{fontWeight : 'bold'}}>Net Weight</TableCell>
                        <TableCell align="right"  sx={{fontWeight : 'bold'}}>Gross Weight</TableCell>
                        <TableCell align="right"  sx={{fontWeight : 'bold'}}>Amount</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                            <div style={{ width: 50, height: 50 }}>
                                <ModalImage
                                    small={row.imageUrl}
                                    large={row.imageUrl}
                                    alt={row.name}
                                />
                            </div>
                            </TableCell>
                            <TableCell align="right">{row.netWeight}</TableCell>
                            <TableCell align="right">{row.grossWeight}</TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2} sx={{fontWeight : 'bold'}}>Total Net Weight</TableCell>
                        <TableCell align="right" sx={{fontWeight : 'bold'}}>{ Number(totalNetWeight.toFixed(2))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{fontWeight : 'bold'}}>Total Gross Weight</TableCell>
                        <TableCell align="right" sx={{fontWeight : 'bold'}}>{ Number(totalGrossWeight.toFixed(2))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{fontWeight : 'bold'}} >Total Amount</TableCell>
                        <TableCell align="right" sx={{fontWeight : 'bold'}}>{ Number(totalAmount.toFixed(2))}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>: 
            <Typography variant='h6'>No Ornaments Added</Typography>
            }
        </TableContainer>
    );
}
