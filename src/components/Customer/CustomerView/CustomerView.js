import React from "react";
import { Dialog, DialogContent,DialogActions,DialogTitle,Box, Tabs, Tab, Button, Typography } from "@mui/material";
import BasicDetails from "./subComponents/BasicDetails";
import BankDetails from "./subComponents/BankDetails";
import Ornaments from "./subComponents/Ornaments";
import Verification from "./subComponents/VerificationDetails";

export default function CustomerView({customer,open,setOpen,ornaments}){
    const [tab,setTab] = React.useState(0)

    const handleTabChange = (e,val) => {
        setTab(val);
    }
    const renderTabContent = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return (
                    <BasicDetails customer={customer}/>
                );
            case 1:
                return <Verification customer={customer}/>
            case 2:
                return <BankDetails customer={customer}/>
            case 3:
                return <Ornaments ornaments={ornaments}/>
            default:
                return <Typography>Unknown Tab</Typography>;
        }
    };

    return(
        <Dialog open={open} onClose={()=>{
            setOpen(false)
            setTab(0)
            }} fullWidth maxWidth >
            <DialogTitle>Customer Details</DialogTitle>
            <DialogContent>
                <Box sx={{width : '100%'}}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab value={0} label="Basic Details"/>
                    <Tab value={1} label="Verification Details"/>
                    <Tab value={2} label="Bank Details"/>
                    <Tab value={3} label="Ornaments"/>
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