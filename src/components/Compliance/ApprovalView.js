import React from "react";
import { Box,Table,IconButton,TableBody, TableCell, TableRow, Paper, TableHead, Button, Typography } from "@mui/material";
import { updateTask } from "../../apis/task";
import { ArrowLeftOutlined, CancelOutlined, CheckOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import Loader from "../Loader";
import { updateBusiness } from "../../apis/business";
import { getOrnamentsList } from "../../apis/ornaments";
import CustomerView from "../Customer/CustomerView/CustomerView";

const ApprovalView = ({data= {},setVisible}) => {
    const [loading,setLoading] = React.useState(false)
    const [customerData, setCustomerData] = React.useState({});
    const [customerDialog,setCustomerDialog] = React.useState(false)
    const [ornaments,setOrnaments] = React.useState()
    const [businessDetails,setBusinessDetails] = React.useState({})
    const handleApprove = async() => {
        setLoading(true)
        if(data.status === "comp_approval"){
        try{
            let status = 'op_approval'
            const res = await updateBusiness(data.businessId._id,{status : status})
            const res2 = await updateTask(data._id,{status : status})
        } catch(error) {
            enqueueSnackbar({message : error.response.data.message,variant : 'error'})
        } finally {
            setLoading(false)
            setVisible(false)
        }
      }else if(data.status === "release_approval"){
        try{
          let status = 'release_op_approval'
          const res = await updateBusiness(data.businessId._id,{status : status})
          const res2 = await updateTask(data._id,{status : status})
      } catch(error) {
          enqueueSnackbar({message : error.response.data.message,variant : 'error'})
      } finally {
          setLoading(false)
          setVisible(false)
      }
      }
    }
    console.log(data);
    const handleCustomerView = async() => {
        try{
            setCustomerData(data.customerId)
            let orn = await getOrnamentsList(data.customerId._id,data.businessId._id)
            setBusinessDetails(data.businessId)
            setOrnaments(orn.data)
            setCustomerDialog(true)
        }
        catch(error) {
            enqueueSnackbar({message : "Error while fetching customer details",variant : 'error'})
        }
        finally {
            setLoading(false)
        }
    }
  
    const customTableRow = (cells) => {
      return (
        <TableRow>
          {cells.map((cell, index) => (
            <React.Fragment key={index}>
              <TableCell sx={{fontFamily: 'Poppins, sans-serif'}}>{cell.label}</TableCell>
              <TableCell>{cell.data}</TableCell>
            </React.Fragment>
          ))}
        </TableRow>
      );
    };
  
    return (
      <Box>
        <Box>
          <Table component={Paper}>
            <TableHead >
              <TableRow>
              <TableCell colSpan={6} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                <IconButton sx={{ 
                }} onClick={() => setVisible(false)}>
                  <ArrowLeftOutlined />
                </IconButton>
                  Lead Data by Telecaller
            </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
             {customTableRow([
              { label: "Telecaller", data: data?.leadId?.assignedTo?.name },
              { label: "Team", data: data?.leadId?.assignedTeam?.name },
              { label: "Lead Generated on", data: data?.leadId?.createdAt },
             ])}
             {customTableRow([
              { label: "Business Source", data: data?.leadId?.source },
              { label: "Lead Verified", data: ((data?.leadId?.verified) ? 'Yes' : 'No') },
              { label: "Lead Verified By", data: data?.leadId?.verifiedBy?.name },
            ])}
              {customTableRow([
              { label: "Business Type", data: data?.leadId?.goldType },
              { label: "Net Weight", data: data?.leadId?.netWeight },
              { label: "Gross Weight", data: data?.leadId?.grossWeight },
            ])}
              <TableRow>
                <TableCell colSpan={6} sx={{fontFamily: 'Poppins, sans-serif'}} align="center">
                  Business Details
                </TableCell>
              </TableRow>
              {customTableRow([
                {label : 'Customer Name',data : data?.customerId?.name},
                {label : 'Phone',data : data?.customerId?.phoneNumber},
                {label : 'D.O.B', data : data?.customerId?.dateOfBirth}
              ])}
              {customTableRow([
                {label : 'Branch',data : data?.businessId?.branchId?.branchName},
                {label : 'Executive',data : data?.assignedTo?.name},
                {label : 'Transaction Type', data : (data?.businessId?.transactionType)}
              ])}
              <TableRow>
                <TableCell colSpan={6} align="center" >
                  <Button onClick={handleCustomerView} sx={{fontFamily: 'Poppins, sans-serif'}} variant="contained">
                    View Complete Customer Details
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{display : 'flex',justifyContent : 'flex-end', m : 2}} gap={2}>
              <Button onClick={handleApprove} disabled={loading} variant="contained" color="success" startIcon={<CheckOutlined/>}>Approve</Button>
              <Button variant="outlined" color={'error'} startIcon={<CancelOutlined/>}>Cancel business</Button>
          </Box>
        </Box>
        <CustomerView open={customerDialog} setOpen={setCustomerDialog} business={businessDetails} customer={customerData} ornaments={ornaments} />
        <Loader loading={loading}/>
      </Box>
    )
  }

export default ApprovalView;