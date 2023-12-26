import React,{useState,useEffect} from "react";
import { Box, Typography, Grid, Divider, Table, TableRow, TableCell, TableHead } from "@mui/material";
import { getFile } from "../../../../apis/fileUpload";
import ModalImage from "react-modal-image";
import { enqueueSnackbar } from "notistack";

export default function Documents({ customer }) {

    const [pan, setPan] = useState('');
    const [idProof, setIdProof] = useState('');
    const [addressProof, setAddressProof] = useState('');
    const [agreementOfPurchase, setAgreementOfPurchase] = useState('');
    const [offerLetter, setOfferLetter] = useState('');
    const [noc, setNoc] = useState('');
    const [authorization, setAuthorization] = useState('');

    useEffect(() => {
        console.log(customer);
        if (customer) {
            fetchImages();
        }
    }, [customer]);

    const fetchImages = async () => {
        const fields = ['panDetails', 'idProof', 'addressProof', 'agreementOfPurchase', 'offerLetterOwnershipDeclaration', 'noc', 'authorizationLetter'];
        
        for (const field of fields) {
            let fileId;
    
            // Check if the field is an object and has a 'file' property
            if (customer[field] && typeof customer[field] === 'object' && customer[field].file) {
                fileId = customer[field].file;
            } else if (customer[field]) {
                fileId = customer[field];
            }
    
            if (fileId) {
                try {
                    const res = await getFile(fileId);
                    if (res && res.data) {
                        const url = res.data; // Assuming response contains the URL directly in 'data'
                        updateState(field, url.data);
                    }
                } catch(error) {
                    enqueueSnackbar({message : error.response.data.error,variant : 'error'})
                }
                
            }
        }
    };

    const updateState = (fieldName, url) => {
        switch (fieldName) {
            case 'panDetails': setPan(url); break;
            case 'idProof': setIdProof(url); break;
            case 'addressProof': setAddressProof(url); break;
            case 'agreementOfPurchase': setAgreementOfPurchase(url); break;
            case 'offerLetterOwnershipDeclaration': setOfferLetter(url); break;
            case 'noc': setNoc(url); break;
            case 'authorizationLetter': setAuthorization(url); break;
            default: break;
        }
    };
    return (
        <Box sx={{height : '60vh'}}>
                <Table>
                <TableHead>
                        <TableCell sx={{fontWeight : 'bold'}}>Document Type</TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Document No.</TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Document Image</TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Document Type</TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Document No.</TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Document Image</TableCell>
                    </TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight : 'bold'}}>Pan Card</TableCell>
                        <TableCell>{customer.panDetails?.number}</TableCell>
                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={pan} large={pan} />
                            </div>
                        </TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>ID Card</TableCell>
                        <TableCell>{customer.idProof?.number}</TableCell>

                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={idProof} large={idProof} />
                            </div>
                        </TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight : 'bold'}}>Address Proof</TableCell>
                        <TableCell>{customer.addressProof?.number}</TableCell>
                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={addressProof} large={addressProof} />
                            </div>
                        </TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Agreement of Purchase</TableCell>
                        <TableCell></TableCell>

                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={agreementOfPurchase} large={agreementOfPurchase} />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight : 'bold'}}>Offer Letter / Ownership Declaration</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={offerLetter} large={offerLetter} />
                            </div>
                        </TableCell>
                        <TableCell sx={{fontWeight : 'bold'}}>Authorization Letter</TableCell>
                        <TableCell></TableCell>

                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={authorization} large={authorization} />
                            </div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{fontWeight : 'bold'}}>NOC</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <div style={{width : '50px',maxWidth : '50px'}}>
                                <ModalImage small={noc} large={noc} />
                            </div>
                        </TableCell>
                        
                    </TableRow>
                </Table>
        </Box>
    )
}