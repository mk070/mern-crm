import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import Navbar from '../Navbar';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';

const Container = styled.div`
  background-color: #f3f4f6;
  min-height: 100vh;
  font-family: 'Salesforce Sans', Arial, sans-serif;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const WelcomeText = styled.h1`
  font-size: 2em;
  font-weight: 600;
  color: #0070d2;
`;

const SectionTitle = styled.h2`
  font-size: 1.5em;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
`;

const CardContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.h3`
  font-size: 1.2em;
  color: #0070d2;
`;

const CardBody = styled.p`
  font-size: 1em;
  color: #555;
`;

function EmployeeHome() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    clients: 0,
    tasks: 0,
    leads: 0,
    notifications: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulate fetching data from an API
    const fetchData = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            clients: 12,
            tasks: 5,
            leads: 8,
            notifications: ['You have tasks due today!'],
          });
        }, 1000);
      });
    };

    fetchData().then((response) => {
      setData(response);
      if (response.notifications.length > 0) {
        setOpen(true);
      }
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (!user) {
    return (
      <Container>
        <Navbar />
        <ContentContainer>
          <CircularProgress />
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <ContentContainer>
        <Header>
          <WelcomeText>Welcome, {user.name}</WelcomeText>
        </Header>
        <SectionTitle>Your Dashboard</SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CardContainer>
              <CardHeader>Assigned Clients</CardHeader>
              <CardBody>You have {data.clients} clients assigned.</CardBody>
            </CardContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardContainer>
              <CardHeader>Tasks</CardHeader>
              <CardBody>{data.tasks} tasks are due today.</CardBody>
            </CardContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CardContainer>
              <CardHeader>Leads</CardHeader>
              <CardBody>You have {data.leads} new leads.</CardBody>
            </CardContainer>
          </Grid>
        </Grid>
      </ContentContainer>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {data.notifications[0]}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EmployeeHome;
