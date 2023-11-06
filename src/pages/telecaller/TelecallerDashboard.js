// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import {  Route, Routes } from 'react-router-dom';
import { DashboardOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import LeadTable from '../../components/tellecaller/AllLeads';
import Dashboard from '../../components/tellecaller/dashboard'
import Assignedleads from '../../components/tellecaller/AssignedLeads'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';

const TeleCallerDashboard = () => {
  const adminRoutes = [
    {name : 'Dashboard', link : '/', icon : <DashboardOutlined />, element : <Dashboard/>},
    {name : 'Assign Leads', link : 'assignLeads', icon : <AssignmentLateOutlinedIcon />, element : <LeadTable/>},
    {name : 'Leads', link : 'assignedLeads', icon : <LeaderboardOutlinedIcon />, element : <Assignedleads/>},
  ]
  return (
    <>
      <Navbar data={adminRoutes}/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="assignLeads" element={<LeadTable />} />
        <Route path="assignedLeads" element={<Assignedleads />} />
      </Routes>
    </>
  );
};

export default TeleCallerDashboard;
