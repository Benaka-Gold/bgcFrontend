import React, { useEffect, useState } from 'react';
import { getFile } from '../../../../apis/fileUpload';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ModalImage from "react-modal-image";

export default function Ornaments({ ornaments }) {
    const [rows, setRows] = useState([]);

    const fetchImages = async () => {
        const updatedRows = await Promise.all(ornaments.map(async (ornament) => {
            const res = await getFile(ornament.image);
            return { ...ornament, imageUrl: res.data.data };
        }));

        setRows(updatedRows);
    };

    useEffect(() => {
        fetchImages();
    }, [ornaments]);

    const totalNetWeight = rows.reduce((sum, row) => sum + row.netWeight, 0);
    const totalGrossWeight = rows.reduce((sum, row) => sum + row.grossWeight, 0);

    return (
        <TableContainer >
            <Table stickyHeader sx={{ minWidth: 700, marginTop : 2 }} aria-label="spanning table">
                <TableHead >
                    <TableRow >
                        <TableCell  sx={{fontWeight : 'bold'}}>Ornament Type</TableCell>
                        <TableCell  sx={{fontWeight : 'bold'}}>Ornament Image</TableCell>
                        <TableCell align="right"  sx={{fontWeight : 'bold'}}>Net Weight</TableCell>
                        <TableCell align="right"  sx={{fontWeight : 'bold'}}>Gross Weight</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                            <div style={{ width: 75, height: 75 }}>
                                <ModalImage
                                    small={row.imageUrl}
                                    large={row.imageUrl}
                                    alt={row.name}
                                />
                            </div>
                            </TableCell>
                            <TableCell align="right">{row.netWeight}</TableCell>
                            <TableCell align="right">{row.grossWeight}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2} sx={{fontWeight : 'bold'}}>Total Net Weight</TableCell>
                        <TableCell align="right">{totalNetWeight}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} sx={{fontWeight : 'bold'}}>Total Gross Weight</TableCell>
                        <TableCell align="right">{totalGrossWeight}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
