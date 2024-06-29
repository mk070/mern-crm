import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';

import logo from './whatsapp-image-20240123-at-1705-1@2x.png';


const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF', // white color for the navbar
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)', // Set background color of the AppBar
          borderRadius: '250px 250px 250px 250px', // Curved corners on both ends
          boxShadow:  '0 4px 6px rgba(0, 0, 0, 0.3)', // Add box shadow
          position: 'relative', // Adjust position
          top: '-40px', // Reset top property
          left: '50%',
          transform: 'translateX(-50%)', // Position at the top of the viewport
          width: '50%',
          right: '120', // Make the width full
          transition: 'background-color 0.3s',
          
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 1)', // Change background color on hover
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '10px 120px',// Reduce padding
          display: 'flex', // Use flexbox
          justifyContent: 'center', // Center the buttons horizontally 
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '16px', // Reduce font size
          
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px', // Reduce button font size
          minWidth: 'auto', // Allow button to shrink
          fontWeight: 'bold', // Make the font bold
         fontFamily: 'Arial, sans-serif', // Use a different font family
        },
      },
    },
  },
});

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    if (!user) {
        return <div>Loading user data...</div>;
    }
  return (
    
    
    <ThemeProvider theme={theme}>
        
      
			  <img src='/logo.png' alt="Logo" style={{ height: '88px', borderRadius:'20px' ,marginTop: '10px'}} />
        <AppBar position="static">
            
          <Toolbar>
            
            
            <Button color="inherit" component={Link} to="/employeehome">Home</Button>
            <Button color="inherit" component={Link} to="/pdf">Leads</Button>
            <Button color="inherit" component={Link} to="/assign">Clients</Button>
            <Button color="inherit" component={Link} to="/task">Task</Button>
            <Button color="inherit" component={Link} to="/projectdetails">Project</Button>
            {/* <Button color="inherit" component={Link} to="/query">Query</Button> */}
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/">Logout</Button>
          </Toolbar>
        </AppBar>
     
    </ThemeProvider>
  );
}

export default Navbar;