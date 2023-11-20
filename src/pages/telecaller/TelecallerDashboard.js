// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import { DashboardOutlined } from '@mui/icons-material';
import LeadTable from '../../components/Telecaller/AllLeads';
import Dashboard from './Dashboard';
// import Assignedleads from './Leads/AssignedLeads';
import Assignedleads from '../../components/Telecaller/AssignedLeads';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';

const TeleCallerDashboard = () => {
  const myObjectSerializedRetrieved = localStorage.getItem("isteamLead");
  const teamLead = JSON.parse(myObjectSerializedRetrieved);
  
  const adminRoutes = [
    { name: 'Dashboard', link: '/', icon: <DashboardOutlined />, element: <Dashboard /> },
    ...(teamLead[0].isTL ? [{ name: 'Assign Leads', link: 'allLeads', icon: <AssignmentLateOutlinedIcon />, element: <LeadTable /> }] : []),
    { name: 'Leads', link: 'leads', icon: <LeaderboardOutlinedIcon />, element: <Assignedleads /> },
  ]
  return (
    <>
      <Navbar data={adminRoutes} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="allLeads" element={<LeadTable />} />
        <Route path="leads" element={<Assignedleads />} />
      </Routes>
    </>
  );
};

export default TeleCallerDashboard;
