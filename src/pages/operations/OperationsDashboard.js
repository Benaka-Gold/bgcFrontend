import React from "react";
import Navbar from '../../components/navBar'
import { Routes, Route } from "react-router-dom";
import { DashboardOutlined, VerifiedOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
export default function OperationsDashboard(){
    const operationsRoutes = [
        {name : 'Dashboard',link : '/',icon : <DashboardOutlined/>,element : <Dashboard/>},
        {name : 'Confirmed Leads',link : '/confirmed-leads',icon : <VerifiedOutlined/> , element : (<>Operations</>)}
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
