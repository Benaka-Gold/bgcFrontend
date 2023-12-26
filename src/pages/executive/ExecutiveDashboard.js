import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes , Navigate} from "react-router-dom";
import { DashboardOutlined } from "@mui/icons-material";
import Dashboard from "./dashboard";
import CustomerDetails from "../../components/Customer/CustomerForm/CustomerBasic/customerDetails";
import BankDetailsForm from '../../components/Customer/CustomerForm/Bank/bankDetailsForm'
import HouseVerification from "../../components/Customer/CustomerForm/HouseVerification/houseVerification";
import OrnamentList from "../../components/Customer/CustomerForm/Ornaments/ornamentList";
import OrnamentUploads from "../../components/Customer/CustomerForm/Ornaments/ornamentUploads";
import VerificationDocuments from "../../components/Customer/CustomerForm/Documents/uploadDocuments";
import PledgedForm from "../../components/Customer/CustomerForm/PledgedDetails/pledged";
import BasicDetails from '../../components/Customer/CustomerForm/basicDetailsSteper/customerForm'
import VerificationalForm from "../../components/Customer/CustomerForm/basicDetailsSteper/verificationForm";
import Bill from "../../components/Customer/Bill/Bill";
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
        <Route path="/" element={<Dashboard />} />
        <Route path="customerdetails" element={<CustomerDetails />} />
        <Route path="customerform" element={<BasicDetails />} />
        <Route path="ornamentuploads" element={<OrnamentUploads />} />
        <Route path="ornamentlist" element={<OrnamentList />} />
        <Route path="bankdetails" element={<BankDetailsForm />} />
        <Route path="verification" element={<VerificationalForm />} />
        <Route path="uploaddocuments" element={<VerificationDocuments />} />
        <Route path="houseverification" element={<HouseVerification />} />
        <Route path="pledeged" element={<PledgedForm />} />
        <Route path="bill/*" element={<Bill/>}/>
      </Routes>
    </>
  );
}

export default ExecutiveDashboard;
