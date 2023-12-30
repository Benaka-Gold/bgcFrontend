import React from "react";
import { Dialog, DialogContent,DialogActions,DialogTitle,Box, Tabs, Tab, Button, Typography } from "@mui/material";
import BasicDetails from "./subComponents/BasicDetails";
import BankDetails from "./subComponents/BankDetails";
import Ornaments from "./subComponents/Ornaments";
import Verification from "./subComponents/VerificationDetails";
import Documents from "./subComponents/Documents";
import BusinessDetails from "./subComponents/BusinessDetails";

export default function CustomerView({customer,open,setOpen,ornaments,business}){
    const [tab,setTab] = React.useState(0)

    const handleTabChange = (e,val) => {
        setTab(val);
    }
    const renderTabContent = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return <BasicDetails customer={customer}/>
            case 1:
                return <Verification customer={customer} business={business}/>
            case 2:
                return <BankDetails customer={customer} business={business}/>
            case 3:
                return <Ornaments ornaments={ornaments}/>
            case 4:
                return <Documents customer={customer} business={business}/> 
            case 5:
                return <BusinessDetails business={business}/> 
            case 6:
                return <Box sx={{height : '60vh'}}>Business Lists</Box>;
            default:
                return <Typography>Unknown Tab</Typography>;
        }
    };

    return(
        <Dialog open={open} onClose={()=>{
            setOpen(false)
            setTab(0)
            }} maxWidth={'lg'} fullWidth>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogContent>
                <Box sx={{width : '100%'}}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab value={0} label="Basic Details"/>
                    {business  ?  <Tab value={1} label="Verification Details"/> : null}
                    
                    {business ? <Tab value={2} label="Bank Details"/> : null }
                    {ornaments ? <Tab value={3} label="Ornaments"/> : null}
                    <Tab value={4} label="Documentation"/>
                    {business ?  <Tab value={5} label="Business Details"/> : <Tab value={6} label="Business List"/>}
                </Tabs>
                {renderTabContent(tab)}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    setOpen(false)
                    setTab(0)
                    }}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}