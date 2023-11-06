// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import {  Route, Routes } from 'react-router-dom';
import { DashboardOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import LeadTable from './Leads/AllLeads';
// import Dashboard from '../../components/tellecaller/Dashboard'
import Dashboard from './Dashboard';
import Assignedleads from './Leads/AssignedLeads'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';

const TeleCallerDashboard = () => {
  const adminRoutes = [
    {name : 'Dashboard', link : '/', icon : <DashboardOutlined />, element : <Dashboard/>},
    {name : 'Assign Leads', link : 'allLeads', icon : <AssignmentLateOutlinedIcon />, element : <LeadTable/>},
    {name : 'Leads', link : 'leads', icon : <LeaderboardOutlinedIcon />, element : <Assignedleads/>},
  ]
  return (
    <>
      <Navbar data={adminRoutes}/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="allLeads" element={<LeadTable />} />
        <Route path="leads" element={<Assignedleads />} />
      </Routes>
    </>
  );
};

export default TeleCallerDashboard;
