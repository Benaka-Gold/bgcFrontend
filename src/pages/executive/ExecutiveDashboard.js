// Executive Dashboard

import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes } from "react-router-dom";
import { DashboardOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import CustomerDetails from "../../components/Executive/CustomerBasic/customerDetails";
import CustomerForm from '../../components/Executive/BasicForms/customerForm'
import BasicDetails from '../../components/Executive/BasicForms/basicDetailsForm'
import OrnamentUploads from "../../components/Executive/Ornaments/ornamentUploads";
import BankDetailsForm from "../../components/Executive/Bank/bankDetailsForm";
import OrnamentList from "../../components/Executive/Ornaments/ornamentList";
import VerificationForm from "../../components/Executive/BasicForms/verificationForm";
import UploadDocuments from "../../components/Executive/Documents/uploadDocuments";
import HouseVerification from "../../components/Executive/HouseVerification/houseVerification";
function ExecutiveDashboard() {
  const ExecutiveRoute = [
    {name: "Dashboard", link: "/",icon: <DashboardOutlined />,element: <Dashboard />,},
  ];
  return (
    <>
      <Navbar data={ExecutiveRoute} />
      <Routes>
        {ExecutiveRoute.map((route, index) => {
          return <Route path={route.link} element={route.element} key={index} />;
        })}
        <Route path="customerdetails" element={<CustomerDetails />} />
        <Route path="customerform" element={<CustomerForm />} />
        <Route path="basicdetails" element={<BasicDetails />} />
        <Route path="ornamentuploads" element={<OrnamentUploads />} />
        <Route path="ornamentlist" element={<OrnamentList />} />
        <Route path="bankdetailsform" element={<BankDetailsForm />} />
        <Route path="verificationform" element={<VerificationForm />} />
        <Route path="uploaddocuments" element={<UploadDocuments />} />
        <Route path="houseverification" element={<HouseVerification />} />
      </Routes>
    </>
  );
}

export default ExecutiveDashboard;
