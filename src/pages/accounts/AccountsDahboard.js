import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes } from "react-router-dom";
import {  ApprovalOutlined, DashboardOutlined, ManOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import ReleaseApproval from "./Approval/ReleaseApproval";
import PurchaseApproval from "./Approval/PurchaseApproval";
import Customers from "./Customer/Customers";

function AccountsDahboard() {
    const accountsRoute = [
        {name: "Dashboard", link: "/",icon: <DashboardOutlined />,element: <Dashboard />},
        {name : "Approvals",link : "approvals",icon : <ApprovalOutlined/>,element : <ReleaseApproval/>},
        // {name : "Purchase Approvals",link : "purchase-approval",icon : <ApprovalOutlined/>,element : <PurchaseApproval/>},
        {name : 'Customers',link : 'customers',icon : <ManOutlined/>,element : <Customers/>},
      ];
  return (
    <>
        <Navbar data={accountsRoute}/>
        <Routes>
            {accountsRoute.map(route => <Route path={route.link} key={route.link} element={route.element}/>)}
        </Routes>
    </>
  )
}

export default AccountsDahboard;
