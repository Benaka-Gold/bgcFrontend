// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import { ApprovalOutlined, Assignment, AssignmentOutlined, BuildOutlined, CurrencyRupeeOutlined, DashboardOutlined, GroupOutlined, List, ListOutlined, MoveDownOutlined, UploadFileOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import LeadsDashboard from './Leads/LeadsDashboard';
import CreateLeads from './Leads/CreateLead';
import MoveLeads from './Leads/MoveLeads';
import EmployeesList from './Employee/EmployeeList';
import BranchList from './Branch/BranchList';
import ConfirmedLeads from './Leads/ConfirmedLeads';
import FundList from './Fund/FundList';
import Divisions from './Divisions/Divisions';
import Approval from '../operations/Approval/Approval';



const AdminDashboard = () => {
  const adminRoutes = [
    {name : 'Dashboard', link : '/', icon : <DashboardOutlined />, element : <Dashboard/>},
    {name : 'Employee', link : 'employee', icon : <VerifiedUserOutlined />, element : <EmployeesList/>},
    {name : 'Leads', link : 'leads', icon : <ListOutlined/>,element : <LeadsDashboard/>, children : [
    {name : 'Create / Upload Leads',link: 'leads/create', icon : <UploadFileOutlined/>},
    {name : 'Move Lead Requests', link: 'leads/move-lead',icon : <MoveDownOutlined/>},
    {name : "Assign Leads",link : 'leads/assign-leads',icon : <AssignmentOutlined/>}
    ]},
    {name : 'Branches',icon : <BuildOutlined />,link : 'branch'},
    {name : "Fund",icon : <CurrencyRupeeOutlined/>,link : 'fund'},
    {name : "Divisions",icon : <BuildOutlined/>,link : 'division'},
    {name : "Approval",icon : <ApprovalOutlined/>,link : 'approval'},
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
        <Route path='branch' element={<BranchList/>}/>
        <Route path='leads/assign-leads' element={<ConfirmedLeads/>}/>
        <Route path='fund' element={<FundList/>}/>
        <Route path='division' element={<Divisions/>}/>
        <Route path='approval' element={<Approval/>}/>
      </Routes> {/* This line allows nested routes to render */}
    </>
  );
};

export default AdminDashboard;
