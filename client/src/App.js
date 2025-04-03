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
import AdminLogin from "./components/admin/admin";
import EmployeeLogin from "./components/employee/EmployeeLogin";
import Side from "./components/admin/side/side";


import EmployeeSignup from "./components/employee/signup/EmployeeSignup";
import Task from "./components/employee/pages/todo";
import Assign from "./components/employee/pages/Assign";
import PDFViewer from "./components/employee/pages/PDFViewer";
import UserSignup from "./components/user/signup/UserSignup";

import Lead from "./components/admin/lead/Lead";
import Calendar from "./components/admin/calendar/calendar";
import EmployeeDetailsComponent from "./components/admin/employeedetails/EmployeeDetailsComponent";
import UserDetailsComponent from "./components/admin/clientdetails/userdetails";
import ErrorBoundary from "./components/ErrorBoundary";
import InvoiceForm from "./components/admin/invoice/components/InvoiceForm";
import Editor from "./components/admin/proposal/Editor";
import Count from "./components/admin/count/count";
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
import ProjectAssignForm from "./components/admin/project/project";
import ProjectDetails from "./components/employee/pages/project";

import Socialmedia from "./components/admin/socialmedia/socialmedia";
import X from "./components/admin/socialmedia/X";
import Facebook from "./components/admin/socialmedia/Facebook";
import Instagram from "./components/admin/socialmedia/Instagram";

import Chatbot from "./components/Chatbot";

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
      <Route path="/crmlogin" element={<CRMLogin />} />
      <Route path="/userlogin" element={<UserLogin/>}/>
      <Route path="/adminlogin" element={<AdminLogin/>}/>
      <Route path='/employeelogin' element={<EmployeeLogin/>}/>

      <Route path="/socialmedia" element={<Socialmedia /> } />
      <Route path="/socialmedia/x" element={<X /> } />
      <Route path="/socialmedia/facebook" element={<Facebook /> } />
      <Route path="/socialmedia/instagram" element={<Instagram /> } />


      <Route path='/usersignup' element={<UserSignup/>}/>
      <Route path='/employeesignup' element={<EmployeeSignup/>}/>

      <Route path='/side' element={<Side/>}/>
      <Route path='/dashboard' element={<Count/>}/>
      <Route path='/lead' element={<Lead/>}/>
      <Route path='/employeedetails' element={<EmployeeDetailsComponent/>}/>
      <Route path='/userdetails' element={<UserDetailsComponent/>}/>
      <Route path='/proposal' element={<Editor/>}/>
      <Route path='/invoice' element={<InvoiceForm/>}/> 
      <Route path='/addadmin' element={<RegisterAdmin/>}/>
      <Route path='/uploadpdf' element={<UploadPDF/>}/>
      <Route path='/project' element={<ProjectAssignForm/>}/>
      <Route path='/calendar' element={<Calendar/>}/>
      <Route path='/' element={<HomePage />}/>

      
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/otherdetails' element={<OtherDetails/>}/>
      
      <Route path='/task' element={<Task/>}/>
      <Route path="/assign" element={<Assign/>}/>
      <Route path='/nav' element={<Navbar/>}/>
      <Route path='/pdf' element={<PDFViewer/>}/>
      <Route path='/employeehome' element={<EmployeeHome/>}/>
      <Route path='/projectdetails' element={<ProjectDetails/>}/>
       
      <Route path='/clientnavbar' element={<ClientNavbar/>}/>
      <Route path='/clientprofile' element={<ClientProfile/>}/>
      <Route path='/clienthome' element={<ClientHome/>}/>
      <Route path='/clientprofile' element={<ClientProfile/>}/>
      <Route path='/product' element={<ProductForm/>}/>
    </Routes> 
    </ErrorBoundary> 
    <Chatbot /> {/* Add Chatbot here */}


    </>
  );
}
export default App;
