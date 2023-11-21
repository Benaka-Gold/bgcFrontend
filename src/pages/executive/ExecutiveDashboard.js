// Executive Dashboard

import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes } from "react-router-dom";
import { DashboardOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import CustomerDetails from "./elements/customerDetails";
import CustomerForm from './elements/customerForm'
import BasicDetails from './elements/basicDetailsForm'
import OrnamentUploads from "./elements/ornamentUploads";
import BankDetailsForm from "./elements/bankDetailsForm";

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
        <Route path="basicdetails" element={<BasicDetails />} />
        <Route path="ornamentuploads" element={<OrnamentUploads />} />
        <Route path="bankdetailsform" element={<BankDetailsForm />} />

      </Routes>
    </>
  );
}

export default ExecutiveDashboard;
