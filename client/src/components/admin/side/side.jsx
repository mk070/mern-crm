import { useState } from "react";
import {  Menu, MenuItem } from "react-pro-sidebar";
import { ProSidebar } from "react-pro-sidebar";

import "react-pro-sidebar/dist/css/styles.css";

import { Box, IconButton, Typography } from "@mui/material";
import logoImage from './logo.png'; 
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { tokens } from "./theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TagIcon from '@mui/icons-material/Tag';
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Side = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <>
    

    <Box
      sx={{
        position:"",
        zIndex:"1",
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={logoImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
            <Item
              title="Lead"
              to="/lead"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Employee details"
              to="/employeedetails"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
            <Item
              title="Social Media"
              to="/socialmedia"
              icon={< TagIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            

            
           
            <Item
              title="Proposal"
              to="/proposal"
              icon={<PictureAsPdfIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoice"
              to="/invoice"
              icon={<DescriptionIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            
            {/* <Item
              title="Assign"
              to="/uploadpdf"
              icon={< AssignmentIndIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            
            <Item
              title="Project"
              to="/project"
              icon={< WorkOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Query"
              to="/querydisplay"
              icon={<QueryBuilderIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            
            <Item
              title="Add Admin"
              to="/addadmin"
              icon={<SupervisorAccountIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             
            <Item
              title="Logout"
              to="/"
              icon={<LogoutIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
    </>
  );
};

export default Side;
