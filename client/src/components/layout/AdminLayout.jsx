import React, { useState } from "react";
// import Sidebar from "./Sidebar";
import { Bell, Search, Sun, Moon, User, Settings } from "lucide-react";
import Sidebar from "../admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <div className="flex h-screen bg-[#F3F4F6]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-[#E5E7EB] h-16 fixed right-0 left-auto w-auto transition-all duration-300 z-30 shadow-sm"
          style={{ left: isSidebarOpen ? '16rem' : '5rem' }}>
          <div className="flex items-center justify-between h-full px-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full py-2 pl-10 pr-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-[#4F46E5]/30 focus:ring-2 focus:ring-[#4F46E5]/20 focus:outline-none transition-all duration-200 font-['Inter',sans-serif] text-sm"
                placeholder="Search..."
              />
            </div>
            
            {/* Right Nav Items */}
            <div className="flex items-center ml-4 space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors" aria-label="Settings">
                <Settings size={20} />
              </button>
              
              <div className="flex items-center border-l border-gray-200 pl-4 ml-2">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#14B8A6] flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline-block font-['Inter',sans-serif]">
                    Admin
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6">
          <Outlet />
      
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;