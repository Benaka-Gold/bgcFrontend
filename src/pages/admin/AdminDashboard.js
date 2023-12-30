// AdminDashboard.js
import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import { ApprovalOutlined, Man2Outlined, AssignmentOutlined, BuildOutlined, CurrencyRupeeOutlined, DashboardOutlined, DocumentScannerOutlined, GroupOutlined, List, ListOutlined, MoveDownOutlined, PriceChangeOutlined, UploadFileOutlined, VerifiedUserOutlined, TaskAltOutlined, MoneyOutlined } from '@mui/icons-material';
import LeadsDashboard from './Leads/LeadsDashboard';
import CreateLeads from './Leads/CreateLead';
import MoveLeads from './Leads/MoveLeads';
import EmployeesList from './Employee/EmployeeList';
import BranchList from './Branch/BranchList';
import ConfirmedLeads from './Leads/ConfirmedLeads';
import FundList from './Fund/FundList';
import Divisions from './Divisions/Divisions';
import Approval from '../operations/Approval/Approval';
import Bill from '../../components/Customer/Bill/Bill';
import GoldRate from '../../components/GoldRate/GoldRate';
import Customers from './Customer/Customers'
import TaskList from '../operations/Task/TaskList';
import BusinessList from '../../components/Business/BusinessList';

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
    // {name : 'Bill',icon : <DocumentScannerOutlined/>,link : 'bill'},
    {name : "Gold Rate",icon : <PriceChangeOutlined />,link : 'gold-rate'},
    {name : 'Customers',link : 'customers',icon : <Man2Outlined/>,element : <Customers/>},
    {name : "Tasks",link : 'tasks',icon : <TaskAltOutlined/>,element : <TaskList/>},
    {name : "Business",link : 'business',icon : <MoneyOutlined/>,element : <BusinessList/>}
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
        <Route path='gold-rate' element={<GoldRate/>}/>
        <Route path='customers' element={<Customers />}/>
        <Route path='tasks' element={<TaskList/>}/>
        <Route path='business' element={<BusinessList/>}/>

      </Routes> {/* This line allows nested routes to render */}
    </>
  );
};

export default AdminDashboard;
