// Executive Dashboard

import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes } from "react-router-dom";
import { DashboardOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import CustomerDetails from "./elements/customerDetails";
import CustomerForm from './elements/customerForm'

function ExecutiveDashboard() {
  const ExecutiveRoute = [
    {name: "Dashboard", link: "/",icon: <DashboardOutlined />,element: <Dashboard />,},
  ];
  return (
    <>
      <Navbar data={ExecutiveRoute} />
      <Routes>
        {ExecutiveRoute.map((route) => {
          return <Route path={route.link} element={route.element} />;
        })}
        <Route path="customerdetails" element={<CustomerDetails />} />
        <Route path="customerform" element={<CustomerForm />} />
      </Routes>
    </>
  );
}

export default ExecutiveDashboard;
