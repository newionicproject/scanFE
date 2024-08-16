/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { SocialLoginList } from "../Social/SocialLoginList";

import { Navigate } from "react-router";
import { AdminDashBoard } from "../AdminDashBoard/AdminDashBoard";
import { DashBoard } from "../DashBoard/DashBoard";
import { LogIn } from "../Dialog/LogIn";
import { LoginDialog } from "../Dialog/LoginDialog";
import { Home } from "../Home/Home";
import { Items } from "../Items/Items";
import { PacManLoader } from "../Loader/PacManLoader";
import { RippleLoader } from "../Loader/RippleLoader";
import { TenantLogIn } from "../Tenant/TenantLogIn";
import { Latest } from "../layouts/Latest/Latest";
import { MultiFileUpload } from "../multiFileUpload/MultiFileUpload";
import { Onboarding } from "../payment/Onboarding";
const isAuthenticated = () => {
  // Check if the user is authenticated. You can use your own logic here.
  // For example, you might check if a user is logged in by looking at session storage.
  
  return sessionStorage.getItem("isAdmin") === "true" ? true:false;
};

const ProtectedRoute = ({ element }:any) => {
  // Check authentication before rendering the route
  return isAuthenticated() ? element : (
    <Navigate to="/adminLogin" />
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Routes:any = [
    //routes
    // { path: "custom", element: <Header /> },
    { path: "/:tenant/home", element: <Home />,showHeader:true  },
    {path:"/:tenant/latest", element: <Latest/>,showHeader:true },
    {path:"/:tenant/login", element: <LoginDialog/>},
    {path:"/onboarding", element: <ProtectedRoute element={<Onboarding/>} showHeader={true} />,showHeader: false},
    {path:"/:tenant/addItems", element: <Items/>},
    {path:"/:tenant/loader", element: <RippleLoader/>},
    {path:"/:tenant/pmloader", element: <PacManLoader/>},
    {path:"/:tenant/tenantLogin", element: <TenantLogIn/>,showHeader: false  },
    { path: "/:tenant/", element: <TenantLogIn />, index: true,showHeader: false  },
    { path: "/adminDashBoard", element: <ProtectedRoute element={<AdminDashBoard />} showHeader={true} /> },
    {path:"/:tenant/dashBoard", element:<DashBoard/>, showHeader:true},
    {path:"/adminLogin", element:<LogIn/>, showHeader:true},
    {path:"/multifile", element:<MultiFileUpload/>, showHeader:true}
   
   
  ];
  
