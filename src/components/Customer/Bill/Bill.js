import React from "react";
import { Box, Typography, Table, TableCell,TableBody,TableRow,TableHead } from "@mui/material";
import ReactToPrint from 'react-to-print';
import { getGoldRate } from "../../../apis/goldRate";

export default function Bill({ data,button = <></> }) {
    
    const [billingRate,setBillingRate] = React.useState(0)
    
    
    const getBillingRate = async()=>{
        var res = await getGoldRate();
        res = res.data?.filter(rate => rate.purity === 100)
        setBillingRate(Number(res[0].price))
    }
    React.useEffect(()=>{
        getBillingRate();
    },[])

    const componentRef = React.useRef();
    return (
        <div>
            <ReactToPrint
                trigger={() => button}
                content={() => componentRef.current}
            />
            <Box display={'none'}>
                <BillPrintable ref={componentRef} data={data} billingRate={billingRate}/>
            </Box>
        </div>
    );
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

const BillPrintable = React.forwardRef(({ data,billingRate }, ref) => {
    return (
        <div ref={ref} >
            <div style={{display : "flex",justifyContent : 'center'}}>
                <img src="/logo/benakaLogo.png" alt="Benaka Logo" style={{ width: '140px', height: 'auto' }}/>
            </div>
            <Typography variant="h1" fontSize={'8mm'} fontWeight={'bold'} align="center" gutterBottom>
            Benaka Gold Company
         </Typography>
        <Typography variant="body2" fontSize={'7mm'}  align="center" gutterBottom>
            {data?.branchId?.branchName} Branch | 63661 11999 | GST: {data?.branchId?.gst}
         </Typography>
        <Box>
            <FirstTable data={data} billingRate={billingRate}/>
        </Box>
        <Box>
            <SecondTable data={data} />
        </Box>
        </div>
    );
});


const FirstTable = ({data,billingRate}) => {
    return(
        <Table size="small">
            <TableBody >
                <TableRow sx={{padding : 'none'}}>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm',padding : 'none'}}>Customer ID</TableCell>
                    <TableCell sx={{fontSize : '5.5mm',padding : 'none'}}> {data?.customerId?.c_id} </TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm',padding : 'none'}} >  Date / Time  </TableCell>
                    <TableCell sx={{fontSize : '5.5mm',padding : 'none'}}> {formatDate(new Date())} </TableCell>
                </TableRow>
                <TableRow sx={{padding : 'none'}}>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm',padding : 'none',wordBreak : false}}>  Customer Name  </TableCell>
                    <TableCell sx={{fontSize : '5.5mm',padding : 'none'}}> {data?.customerId?.name} </TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm',padding : 'none'}}>  Bill ID </TableCell>
                    <TableCell sx={{fontSize : '5.5mm',padding : 'none'}}> BGC{data?.b_id} </TableCell>
                </TableRow>
                <TableRow >
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm'}}>Contact</TableCell>
                    <TableCell sx={{fontSize : '5.5mm'}} >{data?.customerId?.phoneNumber} </TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm'}}>  Gold Price </TableCell>
                    <TableCell sx={{fontSize : '5.5mm'}}> {billingRate} </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm'}} >
                        Address :  
                    </TableCell>
                    <TableCell sx={{fontSize : '5.5mm'}} colSpan={3}>
                        {data?.customerId?.currentAddress}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{fontWeight : 'bold' , fontSize : '5.5mm'}}> ID Proof</TableCell>
                    <TableCell sx={{fontSize : '5.5mm'}}>{data?.customerId?.idProof?.number}</TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5.5mm'}}>Address Proof</TableCell>
                    <TableCell sx={{fontSize : '5.5mm'}}>{data?.customerId?.addressProof?.number}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

const SecondTable = ({data})=>{
    return(
        <Table size="small" sx={{mt : 2}}>
            <TableHead >
            <TableRow>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Ornament Type </TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Gross Weight</TableCell>
                    {/* <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Stone / Wax</TableCell> */}
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Net Weight</TableCell>
                    {/* <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Purity</TableCell> */}
                    <TableCell sx={{fontWeight : 'bold',fontSize : '5mm'}}>Gross Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody >
                {data?.ornaments?.map(ornament => {
                    return(
                    <TableRow key={ornament._id}>
                        <TableCell sx={{fontSize : '5mm'}}>
                            {ornament?.name}
                        </TableCell>
                        <TableCell sx={{fontSize : '5mm'}}>{ornament.grossWeight}</TableCell>
                        {/* <TableCell sx={{fontSize : '5mm'}}>{(Number(ornament.grossWeight) - Number(ornament.netWeight)).toPrecision(2)}</TableCell> */}
                        <TableCell sx={{fontSize : '5mm'}}>{ornament.netWeight}</TableCell>
                        {/* <TableCell sx={{fontSize : '5mm'}}>{ornament.purity.purityName}</TableCell> */}
                        <TableCell sx={{fontSize : '5mm'}}>{new Intl.NumberFormat('en-IN').format(ornament.amount)}</TableCell>
                    </TableRow>)
                })}
            {/* <TableFooter >  */}
                <TableRow>
                    <TableCell sx={{fontSize : '5mm'}}>GRAND TOTAL</TableCell>
                    <TableCell sx={{fontSize : '5mm'}}>{data?.grossWeight}</TableCell>
                    {/* <TableCell sx={{fontSize : '5mm'}}></TableCell> */}
                    <TableCell sx={{fontSize : '5mm'}}>{data?.netWeight}</TableCell>
                    {/* <TableCell sx={{fontSize : '5mm'}}></TableCell> */}
                    <TableCell sx={{fontSize : '5mm'}}></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2} rowSpan={0}/>
                    <TableCell  sx={{fontSize : '5mm'}}>Gross Amount</TableCell>
                    <TableCell sx={{fontSize : '5mm'}}>{data?.grossAmount ? new Intl.NumberFormat('en-IN').format(data?.grossAmount) : 0}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={0} sx={{fontSize : '5mm'}}>GST</TableCell>
                    <TableCell sx={{fontSize : '5mm'}}>{(data?.serviceAmount) ? new Intl.NumberFormat('en-IN').format(data?.serviceAmount) : 0}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={0} sx={{fontSize : '5mm'}}>Release</TableCell>
                    <TableCell sx={{fontSize : '5mm'}}>{(data?.releasingAmount) ? new Intl.NumberFormat('en-IN').format(data.releasingAmount) : 0}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '6mm'}} colSpan={0}>Amount Paid</TableCell>
                    <TableCell sx={{fontWeight : 'bold',fontSize : '6mm'}} >{(data?.totalAmount) ? new Intl.NumberFormat('en-IN').format(data?.totalAmount) : 0}</TableCell>
                </TableRow>
            {/* </TableFooter> */}
            </TableBody>

        </Table>)

}