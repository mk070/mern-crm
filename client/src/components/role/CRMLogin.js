import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, Grid, AppBar, Toolbar, Container, ThemeProvider, createTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import styled from 'styled-components';
// import BackgroundImage from '../home/1.jpg';
// import logo from '../home/whatsapp-image-20240123-at-1705-1@2x.png';

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8));
  background-size: cover;
`;

const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backgroundImage: 'linear-gradient(to top right, rgba(255, 255, 255, 0.6), rgba(250, 250, 250, 0.9))',
          borderRadius: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto Condensed", sans-serif',
        },
      },
    },
  },
});

function CardsPage() {
  const navigate = useNavigate();

  const iconMap = {
    Client: <AccountCircleIcon style={{ fontSize: 90, color: 'black' }} />,
    Admin: <AdminPanelSettingsIcon style={{ fontSize: 90, color: 'black' }} />,
    Employee: <WorkIcon style={{ fontSize: 90, color: 'black' }} />,
  };

  return (
    <ThemeProvider theme={theme}>
      <AnimatedBackground>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <img src='/logo.png' alt="Logo" style={{ height: '88px',borderRadius: '20px' ,marginTop: '10px'}} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" style={{ paddingTop: 50, paddingBottom: 50 }}>
          <Grid container spacing={4} justifyContent="center">
            {[
              // { title: 'CLIENT', path: '/userlogin', icon: iconMap.Client },
              { title: 'ADMIN', path: '/adminlogin', icon: iconMap.Admin },
              { title: 'EMPLOYEE', path: '/employeelogin', icon: iconMap.Employee },
            ].map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card elevation={0} style={{ minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <CardActionArea onClick={() => navigate(item.path)}>
                    <CardContent style={{ textAlign: 'center' }}>
                      <Typography gutterBottom variant="h5" component="div" style={{ color: 'black', fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      {item.icon}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </AnimatedBackground>
    </ThemeProvider>
  );
}

export default CardsPage;
