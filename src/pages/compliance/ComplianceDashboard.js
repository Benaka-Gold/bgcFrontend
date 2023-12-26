import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import { ApprovalOutlined, DashboardOutlined } from '@mui/icons-material';
import Approval from './Approval/Approval';
export default function ComplianceDashboard(){

    const complianceRoutes = [
        {name : 'Dashboard', link : '/', icon : <DashboardOutlined />, element : <Dashboard/>},
        {name : 'Approval', link : 'approvals', icon : <ApprovalOutlined />, element : <Approval/>},

    ];

    return(
        <>
        <Navbar data={complianceRoutes}/>
        <Routes>
            {complianceRoutes.map(route => <Route path={route.link} key={route.link} element={route.element}/>)}
        </Routes>
        </>
    )
}