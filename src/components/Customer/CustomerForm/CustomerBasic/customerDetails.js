import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, Button} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import {  executiveTask,updateTask } from '../../../../apis/task';
import { updateBusiness, getBussiness } from '../../../../apis/business';
import { uploadfiles } from '../../../../apis/fileUpload';
import ReleaseCopyDialog from './subComponent/releaseCopyDialog';
import UpdateBranchDialog from './subComponent/updateBranchDialog';
import FeedbackDialog from './subComponent/cancelBusinessDialog';
import { CustomerDetailItem, RenderButton, VerificationOptions,
         StartedPurchase, PledgedVerification, initialStatus,
} from './subComponent/CustomerVerification';
import Loader from '../../../Loader';
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { generateBill } from '../../../../apis/business';
import Bill from '../../Bill/Bill';
import PrintIcon from '@mui/icons-material/Print';

const CustomerDetails = () => {
  const [assignedTask, setAssignedTask] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPledged, setIsPledged] = useState(false)
  const [display, setDisplay] = useState({});
  const [businessData, setBussinessData] = useState([])
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [businessId, setBusinessId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelBusinessOpen, setCancelbusinessOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const customerId = query.get('filter');
  const [data, setData] = useState([])

  const fetchAssignedTask = async () => {
    setLoading(true)
    try {
      const res = await executiveTask();
      if (res?.data?.data) {
        const filteredTask = res.data.data.filter(item => item.customerId._id === customerId);
        setAssignedTask(filteredTask);
        setDisplay(filteredTask[0].state)
        const updatedData = checkDescription(filteredTask);
        setIsPledged(updatedData)
        const businessIds = filteredTask.map(item => item?.businessId);
        setBusinessId(businessIds[0])
        const response = await getBussiness(businessIds && businessIds[0])
        setBussinessData(response?.data)
      }else{
        navigate('/')
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }finally{
        setLoading(false)
    }
  };
  useEffect(() => {
    fetchAssignedTask();
  }, [customerId]);

  const Task = assignedTask?.find(lead => lead.customerId._id === customerId);
    const handleStart = async () => {
    if (Task) {
      const updatedTask = { ...Task, status: 'started', state: initialStatus };
      setLoading(true)
      setTimeout(async () => {
        setLoading(false)
        try{
        let response = await updateTask(updatedTask._id, updatedTask);
        if (response.status === 200) {
          fetchAssignedTask()
        }
      }catch(error){
      enqueueSnackbar({message : error.message ,variant : 'error'})
      }
      }, 250)
    } 
  };
console.log(assignedTask);
  const handlePurchase = () => {
    if (Task) {
      const updatedTask = { ...Task, status: 'purchase_started' };
      setLoading(true)
      setTimeout(async () => {
        setLoading(false)
        try{
        let response = await updateTask(updatedTask._id, updatedTask);
        if (response.status === 200) {
          fetchAssignedTask()
        }
      }catch(error){
      enqueueSnackbar({message : "Release Image Submitted" ,variant : 'success'})
      }
      })
    } 
  }

  const handleFileChange = async(event) => {
    const name = assignedTask.length > 0 ? assignedTask[0].customerId.name : null;
    if (!name) {
      console.error('Customer name not found');
      return;
    }
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    try {
        const res = await uploadfiles(file, "customer", `${name}/releaseCopy`);
        if (res.success) {
            setSelectedFile(res.data._id)
        } else {
            throw new Error(res.error || 'File upload failed');
        }
    } catch (error) {
        console.error(error);
    }
};

  const handleSubmit =async () => {
    setOpen(false)
    let updatedBusiness = { ...businessData, releaseCopy : selectedFile };
    try {
      let response = await updateBusiness(businessId, updatedBusiness)
      if(response.data){
      enqueueSnackbar({message : "Release Image Submitted" ,variant : 'success'})
      setLoading(true)
      setTimeout(()=>{
        handlePurchase()
        fetchAssignedTask()
        setLoading(false)
      }, 250)
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    }
};

  const canSendApproval = (keySet) => {
    if (!display) {
      return false;
    }
    let keysToCheck = [];
    switch (keySet) {
      case 'all':
        keysToCheck = Object.keys(display); 
        break;
      case 'setA':
        keysToCheck = ["isBasicDetails","isOrnamentDetails", "isVerification", "isBankDetails", "isDocumentsUpload"  ] 
        break;
      case 'setB':
        keysToCheck = ["isBasicDetails", "isVerification", "isPledgedDoc" ]
        break;
        case 'setC':
        keysToCheck = ["isOrnamentDetails", "isBankDetails", "isDocumentsUpload" ]
        break;
      default:
        console.error("Invalid key set specified");
        return false;
    }
    return keysToCheck.every(key => display[key] === true);
};

  const updateApproval = async (status) => {
    const task = assignedTask.find(lead => lead.customerId._id === customerId);
    if (!task) {
      console.error('Lead not found');
      return;
    }
    let updatedTask = { ...task, status };
    let updatedBusiness = { ...businessData, status };
    try {
      setLoading(true);
      const response = await updateTask(updatedTask._id, updatedTask);
      const businessResponse = await updateBusiness(businessId, updatedBusiness);
      if (response.data && businessResponse.data) {
        enqueueSnackbar({message : 'Approval Sent' ,variant : 'success'})
        fetchAssignedTask();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      enqueueSnackbar({message : error.message ,variant : 'error'})
    } finally {
      setTimeout(()=>{
        setLoading(false);
      }, 250)
    }
  };

  const checkDescription = (dataArray) => {
    return dataArray.some(item => item.description === "Releasing Pledged Gold");
  };

  const handleApproval = () => {
    const status = isPledged ? 'release_approval' : 'op_approval';
    updateApproval(status);
  };
 
  const purchaseApproval = () => {
    updateApproval('op_approval');
  };

  const checkStatus = (status) => {
    return assignedTask.every(lead => lead.status === status);
  };

  const isPledgeApproval = () => {
    return assignedTask.every(lead => lead.status === "op_approved");
  };

  const getCurrentState = () => {
    if (checkStatus("release_approved")) return "accountsApproved";
    if (checkStatus("purchase_started")) return "purchaseStarted";
    if (assignedTask.some(lead => lead.status === 'op_approval' || lead.status === 'release_approval')) return "approvalSent";
    if (checkStatus("pending")) return "notStarted";
    if (checkStatus("started")) return "Started";
    if (checkStatus("op_approved")) return "operationsApproved";
    if(checkStatus("cancel_approved") )return "cancelApproved"
    return "notStarted";
  };


  const handleUpdateBranch =()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      setDialogOpen(true)
    }, 250)
  }

  const handleUpdateReleaseCopy =()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      setOpen(true)
    }, 250)
  }

  const fetchData = async() => {
    if (!businessId) { 
      return; 
    }
    try {
      setLoading(true); 
      const res = await generateBill(businessId);
      if(res && res.data){
        setData({...res.data.business, ornaments: res.data.ornaments});
      } 
    } catch (error) {
      enqueueSnackbar({message: error.message || "Failed to fetch bill details", variant: 'error'});
    } finally {
      setLoading(false); 
    }
  }
  
  useEffect(() => {
    fetchData(); 
  }, [businessId]);
  
  const renderCancelButton = () => {
    return  (
      <Box sx={{mt:2}}>
        <Button 
          variant='contained' 
          color="error" 
          sx={{ width: '70%', fontFamily: 'Poppins, sans-serif' }}
          onClick={() => setCancelbusinessOpen(true)} 
          disabled={businessData.status === "cancel_approval" ||businessData.status === "cancel_approved"}
        >
          {businessData.status === "cancel_approval" ||businessData.status === "cancel_approved" ? "Waiting For Approval" : "Cancel Business"}
        </Button>
      </Box>
    ) 
  };
  const currentState = getCurrentState();
  const renderContent = () => {
    if (loading) {
      return setLoading(false)
  }
  if (!businessData || !assignedTask.length) {
      return null; 
  }
    switch (currentState) {
      case "notStarted":
        return (
          <>
            <Button variant="contained" endIcon={<SendIcon />} onClick={handleUpdateBranch}
              sx={{ mt: 3, alignSelf: 'center', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
            >Start</Button>
            {renderCancelButton()}
          </>
        );

      case "Started":
        return (
          <Box>
            {isPledged ? <PledgedVerification customerId={customerId} display={display}  /> : <VerificationOptions customerId={customerId} display={display} />}
            {(isPledged ? canSendApproval('setB') : canSendApproval('setA') )?
              <RenderButton onClick={handleApproval} disabled={checkStatus('op_approval')} buttonText={checkStatus('op_approval') ? "Waiting for Approval" : "Send Approval"} endIcon={<SendIcon />} />
              : ""} 
          {renderCancelButton()}
          </Box>
        );

      case "approvalSent":
        return (
          <Box>
            {isPledged ?
              <>
                <PledgedVerification customerId={customerId} display={display} />
                {checkStatus('op_approval')  ? <StartedPurchase customerId={customerId} display={display} /> : ""}
                {checkStatus('op_approval') ? <RenderButton onClick={handleApproval} disabled={checkStatus('op_approval')} buttonText="Waiting for Approval" endIcon={<SendIcon />} />:
                <RenderButton onClick={handleApproval} disabled={checkStatus('release_approval')} buttonText="Waiting for Approval" endIcon={<SendIcon />} />  }
                 {renderCancelButton()}
              </>
              :
              <>
                <VerificationOptions customerId={customerId} display={display} />
                <RenderButton onClick={handleApproval} disabled={checkStatus('op_approval')} buttonText="Waiting for Approval" endIcon={<SendIcon />} />
                {renderCancelButton()}
              </>
            }
          </Box>
        );

      case "accountsApproved":
        return (
          <Box>
            <PledgedVerification customerId={customerId} display={display} />
            {checkStatus("release_approved") ?
              <>
               <RenderButton onClick={handleUpdateReleaseCopy} buttonText="Start Purchase" endIcon={<SendIcon />} /> 
              </>
              :
              <RenderButton onClick={handleApproval} disabled={checkStatus("release_approved")} buttonText={checkStatus("release_approved") ? "Waiting for Approval" : "Send Approval"} endIcon={<SendIcon />} />
            }
            {renderCancelButton()}
          </Box>
        );

      case "purchaseStarted":
        return (
          <Box>
            <PledgedVerification customerId={customerId} display={display} />
            {checkStatus("purchase_started") ?
              <>
                <StartedPurchase customerId={customerId} display={display} />
                {canSendApproval('setC') ?
                  <RenderButton onClick={purchaseApproval} disabled={checkStatus('op_approval')} buttonText={checkStatus('op_approval') ? "Waiting for Approval" : "Send Approval"} endIcon={<SendIcon />} />
                  : ""}
              </> :
              <RenderButton onClick={handlePurchase} buttonText="Start Purchase" endIcon={<SendIcon />} />
            }
            {renderCancelButton()}
          </Box>
        );

        case "operationsApproved" :
          return(
            <Box>
              {isPledged ? 
              <>
              <PledgedVerification customerId={customerId} display={display} isPledgeApproval={isPledgeApproval()} disabled={true} />
              <StartedPurchase customerId={customerId} display={display} isPledgeApproval={isPledgeApproval()} disabled={true} />
               <Bill data={data} button={<Button variant='contained'   color="info" sx={{ width: '50%', fontFamily: 'Poppins, sans-serif' }}  endIcon={<PrintIcon />}>Print Bill</Button>} />
              </> :
              <>
              <VerificationOptions customerId={customerId} display={display} isPledgeApproval={isPledgeApproval()} disabled={true}/>
              <Bill data={data} button={<Button variant='contained'   color="info" sx={{ width: '50%', fontFamily: 'Poppins, sans-serif' }}  endIcon={<PrintIcon />}>Print Bill</Button>} />
              </>
              }
            </Box>
          )
      default:
        return <Typography variant="h6">Cancelled </Typography>;
    }
  };
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
    <Box
      sx={{
        width: { md: "calc(100% - 240px)", sm: "calc(100% - 240px)", xs: "100%", lg: "calc(100% - 240px)" },
        height: "auto", ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" }, mt: { lg: 5, sm: 5, xs: 0, md: 5 }}}>
      <Box sx={{ width: "100%", height: "100%", margin: 'auto' }}>
        <Card sx={{ p: 3, width: { md: "70%", sm: "70%", xs: "100%", lg: "30%" }, margin: "auto", boxShadow: '1px 1px 20px rgba(0,0,0,0.1)', borderRadius: 2, display: "flex", flexDirection: "column" }}>
          {assignedTask.map((item, index) => (
            <Box key={index} sx={{ width: '100%' }}>
              <Box sx={{ display: "flex", height: "auto", width: "auto", justifyContent: "center" }}>
                <ArrowBackIcon onClick={() => navigate(`/`)} sx={{ fontSize: 30, mt: 2, cursor: "pointer" }} />
                <Typography variant="h5" sx={{ p: 2 }}>  Customer Details </Typography>
              </Box>
              <CustomerDetailItem title="Name" detail={item.customerId.name} />
              <CustomerDetailItem title="Email" detail={item.customerId.email} />
              <CustomerDetailItem title="Phone" detail={item.customerId.phoneNumber} />
              <CustomerDetailItem title="Address" detail={item.customerId.currentAddress} />
            </Box>
          ))}
           { (businessData.status === "cancel_approval" ||  businessData.status === "cancel_approved" )? renderCancelButton() : renderContent() }
        </Card>
        <Loader loading={loading} />
      </Box>
      < ReleaseCopyDialog
        open={open} setOpen={setOpen}  handleFileChange={handleFileChange} handleSubmit={handleSubmit}
        imagePreview={imagePreview}  setImagePreview={setImagePreview} selectedFile={selectedFile}
        setSelectedFile={setSelectedFile} handlePurchase={handlePurchase} fetchAssignedTask={fetchAssignedTask} />
      <UpdateBranchDialog  open={dialogOpen} setDialogOpen={setDialogOpen}  businessId={businessId} 
        businessData={businessData}   handleStart={handleStart} />
        <FeedbackDialog open={cancelBusinessOpen} handleClose={() => setCancelbusinessOpen(false)} setLoading={setLoading} fetchTask={fetchAssignedTask}  />
    </Box>
    </SnackbarProvider>
  );
};
export default CustomerDetails;