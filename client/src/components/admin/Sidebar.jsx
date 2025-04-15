import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
  MessageSquare,
  Briefcase,
  FileCheck,
  FileSpreadsheet,
  UserPlus,
  ChevronDown,
  Share2,
  Clock,
  CheckSquare,
  PlusCircle
} from 'lucide-react';
import { BiMoney } from 'react-icons/bi';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Leads', path: '/lead' },
  { icon: FileText, label: 'Employee Details', path: '/employeedetails' },
  {
    icon: MessageSquare,
    label: 'Social Media',
    path: '/socialmedia',
    submenu: [
      { icon: Share2, label: 'Connect Accounts', path: '/socialmedia/connect' },
      { icon: PlusCircle, label: 'Create Post', path: '/socialmedia/create' },
      { icon: Clock, label: 'Scheduled Posts', path: '/socialmedia/scheduled' },
      { icon: CheckSquare, label: 'Posted Posts', path: '/socialmedia/posted' },
    ]
  },
  { icon: FileCheck, label: 'Proposals', path: '/proposal' },
  {
    icon: BiMoney,
    label: 'Financials',
    path: '/payments-invoicing',
    submenu: [
      { icon: LayoutDashboard, label: 'Payments Dashboard', path: '/payments-invoicing/Payments' },
      { icon: FileText, label: 'Invoice Generator', path: '/payments-invoicing/invoice' },
      { icon: CheckSquare, label: 'Track Invoices', path: '/payments-invoicing/track' },
      { icon: Clock, label: 'Payment Reminders', path: '/payments-invoicing/reminders' },
      // { icon: CheckSquare, label: 'Posted Posts', path: '/socialmedia/posted' },
    ]
  },
  // { icon: FileSpreadsheet, label: 'Invoices', path: '/invoice' },
  { icon: Briefcase, label: 'Projects', path: '/projects' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: UserPlus, label: 'Add Admin', path: '/addadmin' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  // { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const location = useLocation();

  const toggleSubmenu = (path) => {
    setExpandedSubmenu(expandedSubmenu === path ? null : path);
  };

  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-neutral-surface border-r border-neutral-border transition-all duration-300 z-20
        ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-neutral-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <Building2 className="h-8 w-8 text-primary" />
          {!collapsed && (
            <span className="font-jakarta font-bold text-xl bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              CRM Pro
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-neutral-bg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`h-5 w-5 text-neutral-text-secondary transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(item.path);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedSubmenu === item.path;
            
            return (
              <li key={item.path} className={hasSubmenu ? 'space-y-1' : ''}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.path)}
                      className={`w-full flex de items-center justify-between px-3 py-2 rounded-xl transition-all duration-200
                        ${isActive ? 'bg-primary-light text-primary' : 'text-neutral-text-primary hover:bg-neutral-bg'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="font-medium font-inter">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                    {!collapsed && isExpanded && (
                      <ul className="pl-4 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path} style={{ textDecoration: 'none' }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                                  ${isSubActive ? 'bg-primary text-white' : 'text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary'}`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span className="font-medium font-inter text-sm">{subItem.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-white'  
                        : 'text-slate-800 hover:bg-neutral-bg'}`} style={{ textDecoration: 'none' }}
                  >
                    <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                    {!collapsed && <span className="font-medium font-inter">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Link
            to="/logout"
            className="flex items-center gap-3 px-3 py-2 text-neutral-text-secondary hover:bg-neutral-bg hover:text-neutral-text-primary rounded-xl transition-all duration-200"
          >
            <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
            {!collapsed && <span className="font-medium font-inter">Logout</span>}
          </Link>
        </div>
      </nav>
    </div>
  );
}