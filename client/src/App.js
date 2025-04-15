import { useEffect } from "react";

import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";

import HomePage from "./components/home/HomePage";
import CRMLogin from "./components/role/CRMLogin";
import UserLogin from "./components/user/UserLogin";
import AdminLogin from "./components/admin/Admin";
import EmployeeLogin from "./components/employee/EmployeeLogin";


import EmployeeSignup from "./components/employee/signup/EmployeeSignup";
import Task from "./components/employee/pages/todo";
import Assign from "./components/employee/pages/Assign";
import PDFViewer from "./components/employee/pages/PDFViewer";
import UserSignup from "./components/user/signup/UserSignup";

import Lead from "./components/admin/lead/Lead";
import Calendar from "./components/admin/calendar/calendar";
import EmployeeDetailsComponent from "./components/admin/employeedetails/EmployeeDetailsComponent";
// import UserDetailsComponent from "./components/admin/clientdetails/userdetails";
import ErrorBoundary from "./components/ErrorBoundary";
import InvoiceForm from "./components/admin/invoice/components/InvoiceForm";
import Dashboard from "./components/admin/Dashboard";
import RegisterAdmin from "./components/admin/add/registeradmin";
import UploadPDF from "./components/admin/employeedetails/uploadpdf";
import Navbar from "./components/employee/Navbar";
import EmployeeHome from "./components/employee/pages/employeehome";

import Profile from "./components/employee/pages/profile";
import OtherDetails from "./components/employee/profile/otherdetails";
import ClientNavbar from "./components/user/clientnavbar";
import ClientProfile from "./components/user/pages/clientprofile";
import ClientHome from "./components/user/pages/clienthome";

import ProductForm from "./components/user/proddetails";
// import ProjectDetails from "./components/employee/pages/project";

import Socialmedia from "./components/admin/socialmedia/socialmedia";
import X from "./components/admin/socialmedia/X";
import Facebook from "./components/admin/socialmedia/Facebook";
import Instagram from "./components/admin/socialmedia/Instagram";

import Chatbot from "./components/Chatbot";
import AdminLayout from "./components/layout/AdminLayout";
import SocialMediaConnect from "./components/admin/socialmedia/SocialMediaConnect";
import CreatePost from "./components/admin/socialmedia/CreatePost";
import ScheduledPost from "./components/admin/socialmedia/ScheduledPost";
import Posts from "./components/admin/socialmedia/Posts";
import ProposalsPage from "./components/admin/proposal/ProposalsPage";
import { PaymentsDashboard } from "./components/admin/Payments_Invoicing/PaymentsDashboard";
import { InvoiceGenerator } from "./components/admin/Payments_Invoicing/InvoiceGenerator";
import TrackInvoices from "./components/admin/Payments_Invoicing/TrackInvoices";
import { PaymentReminders } from "./components/admin/Payments_Invoicing/PaymentReminders";
import ClientsDashboard from "./components/admin/clientdetails/ClientsDashboard";
import ProjectsDashboard from "./components/admin/projects/ProjectsDashboard";
import ProjectDetails from "./components/admin/projects/ProjectDetails";
import { EmployeesDashboard } from "./components/admin/employeedetails/EmployeesDashboard";
// import ProposalDashboard from "./components/admin/proposal/ProposalDashboard";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  
  
  
  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<CRMLogin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/employeelogin" element={<EmployeeLogin />} />

          

          <Route path="/usersignup" element={<UserSignup />} />
          <Route path="/employeesignup" element={<EmployeeSignup />} />

          <Route path="/" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lead" element={<Lead />} />
            <Route path="/employeedetails" element={<EmployeesDashboard />} />
            <Route path="/clients" element={<ClientsDashboard />} />

            <Route path="/projects" element={<ProjectsDashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />

            <Route path="proposal" element={<ProposalsPage />} />
            

            <Route path="invoice" element={<InvoiceForm />} />

            {/* <Route path="payments-invoicing" element={<PaymentsDashboard />} /> */}
            <Route path="/payments-invoicing/Payments" element={<PaymentsDashboard />} />    
            <Route path="/payments-invoicing/invoice" element={<InvoiceGenerator />} />
            <Route path="/payments-invoicing/track" element={<TrackInvoices />} />
            <Route path="/payments-invoicing/reminders" element={<PaymentReminders />} />

            
            <Route path="addadmin" element={<RegisterAdmin />} />
            <Route path="uploadpdf" element={<UploadPDF />} />
            <Route path="calendar" element={<Calendar />} />
              <Route path="/socialmedia/connect" element={<SocialMediaConnect />} />
              <Route path="/socialmedia/create" element={<CreatePost />} />
              <Route path="/socialmedia/scheduled" element={<ScheduledPost />} />
              <Route path="/socialmedia/posted" element={<Posts />} />
              <Route path="/socialmedia/facebook" element={<Facebook />} />
              <Route path="/socialmedia/instagram" element={<Instagram />} />
          </Route>

          <Route path="/" element={<HomePage />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/otherdetails" element={<OtherDetails />} />

          <Route path="/task" element={<Task />} />
          <Route path="/assign" element={<Assign />} />
          <Route path="/nav" element={<Navbar />} />
          <Route path="/pdf" element={<PDFViewer />} />
          <Route path="/employeehome" element={<EmployeeHome />} />
          {/* <Route path="/projectdetails" element={<ProjectDetails />} /> */}

          <Route path="/clientnavbar" element={<ClientNavbar />} />
          <Route path="/clientprofile" element={<ClientProfile />} />
          <Route path="/clienthome" element={<ClientHome />} />
          <Route path="/product" element={<ProductForm />} />
        </Routes>
      </ErrorBoundary>
      <Chatbot /> {/* Add Chatbot here */}
    </>
  );
}
export default App;
