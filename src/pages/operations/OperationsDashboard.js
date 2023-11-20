import React from "react";
// import Navbar from '../../components/navBar'
import Navbar from '../../components/navBar/Navbar'
import { Routes, Route } from "react-router-dom";
import { DashboardOutlined, VerifiedOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import ConfirmedLeads from "../admin/Leads/ConfirmedLeads";
export default function OperationsDashboard(){
    const operationsRoutes = [
        {name : 'Dashboard',link : '/',icon : <DashboardOutlined/>,element : <Dashboard/>},
        {name : 'Confirmed Leads',link : 'confirmed-leads',icon : <VerifiedOutlined/> , element : <ConfirmedLeads/>},
        
    ]
    return(<>
        <Navbar data={operationsRoutes}/>
        <Routes>
            {operationsRoutes.map(route => {
              return  <Route path={route.link} element={route.element}/>
            })}
        </Routes>
    </>)
}
