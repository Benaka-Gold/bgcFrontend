import React from "react";
import Navbar from "../../components/navBar/Navbar";
import { Route, Routes , Navigate} from "react-router-dom";
import { DashboardOutlined, MoneyOutlined, VerifiedUserRounded } from "@mui/icons-material";
import Dashboard from "./dashboard";
import GoldRate from "../../components/GoldRate/GoldRate";
import EmployeesList from "../admin/Employee/EmployeeList";
import CustomerList from "../../components/Customer/CustomerList/CustomerList";

export default function MdDashboard(){
    const MDRoutes = [
        {name: "Dashboard", link: "/",icon: <DashboardOutlined />,element: <Dashboard />,},
        {name : "Gold Rate",icon : <PriceChangeOutlined />,link : 'gold-rate',element : <GoldRate/>},
        {name : 'Employees',icon : <VerifiedUserRounded/>,link : 'employees',element : <EmployeesList/>},
        {name : 'Business',icon : <MoneyOutlined/>,link : 'business-list'},
        {name : 'Customers',icon : <UserActivation/>,link : 'customers',element : <CustomerList/>},
      ];
    return(
        <>
            <Navbar data={MDRoutes}/>
            <Routes>
            {MDRoutes.map((route, index) => {
                return <Route path={route.link} element={route?.element} key={index} />;
            })}
            </Routes>
        </>
    )
}
