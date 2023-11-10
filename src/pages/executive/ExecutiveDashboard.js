// Executive Dashboard

import React from 'react';
import Navbar from '../../components/navBar/Navbar';
import { Route, Routes } from 'react-router-dom';
import { DashboardOutlined } from "@mui/icons-material";
import Dashboard from './dashboard'


function ExecutiveDashboard (){
    const ExecutiveRoute = [
        {name : 'Dashboard',link : '/',icon : <DashboardOutlined/>,element : <Dashboard/>},
    ]
  return(<>
    <Navbar data={ExecutiveRoute}/>
    <Routes>
        {ExecutiveRoute.map(route => {
            return <Route path={route.link} element={route.element}/>
        })}
    </Routes>
</>)
}

export default ExecutiveDashboard;

