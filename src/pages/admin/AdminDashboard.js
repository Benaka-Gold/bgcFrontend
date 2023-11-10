// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import { DashboardOutlined, GroupOutlined, List, ListOutlined, MoveDownOutlined, UploadFileOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import LeadsDashboard from './Leads/LeadsDashboard';
import CreateLeads from './Leads/CreateLead';
import MoveLeads from './Leads/MoveLeads';
import EmployeesList from './Employee/EmployeeList';



const AdminDashboard = () => {
  const adminRoutes = [
    {name : 'Dashboard', link : '/', icon : <DashboardOutlined />, element : <Dashboard/>},
    {name : 'Employee', link : 'employee', icon : <VerifiedUserOutlined />, element : <EmployeesList/>},
    {name : 'Leads', link : 'leads', icon : <ListOutlined/>,element : <LeadsDashboard/>, children : [
    {name : 'Create / Upload Leads',link: 'leads/create', icon : <UploadFileOutlined/>},
    {name : 'Move Lead Requests', link: 'leads/move-lead',icon : <MoveDownOutlined/>},
    ]}

  ]

  return (
    <>
      <Navbar data={adminRoutes}/>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="employee" element={<EmployeesList />} />
        <Route path='leads' element={<LeadsDashboard />}/>
        <Route path='leads/create' element={<CreateLeads/>}/>
        <Route path='leads/move-lead' element={<MoveLeads/>}/>
      </Routes> {/* This line allows nested routes to render */}
    </>
  );
};

export default AdminDashboard;
