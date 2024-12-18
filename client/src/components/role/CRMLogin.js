import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Container, ThemeProvider, createTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import styled from 'styled-components';
import { gsap } from 'gsap';

const theme = createTheme({
  typography: {
    fontFamily: 'Salesforce Sans, Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s, transform 0.3s',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
});

const cardsData = [
  { title: 'ADMIN', path: '/adminlogin', icon: <AdminPanelSettingsIcon style={{ fontSize: 70, color: '#0070d2' }} /> },
  { title: 'EMPLOYEE', path: '/employeelogin', icon: <WorkIcon style={{ fontSize: 70, color: '#0070d2' }} /> },
];

const StyledAppBar = styled(AppBar)`
  background-color: transparent !important;
  box-shadow: none !important;
`;

const StyledLogo = styled.img`
  height: 88px;
  border-radius: 12px;
  margin-top: 10px;
`;

const Carousel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 1s ease;
`;

const CarouselCard = styled.div`
  min-width: 300px;
  margin: 0 15px;
`;

function CardsPage() {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  useEffect(() => {
    gsap.from(cardRefs.current, {
      duration: 1,
      y: 50,
      opacity: 0,
      stagger: 0.3,
      ease: 'power3.out',
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(trackRef.current, {
        xPercent: -100 * ((cardsData.length - 1) / cardsData.length),
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          trackRef.current.appendChild(trackRef.current.children[0]);
          gsap.set(trackRef.current, { xPercent: 0 });
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="static">
        <Toolbar>
          <StyledLogo src='/logo.png' alt="Logo" />
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="lg" style={{ paddingTop: 50, paddingBottom: 50, minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" align="center" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
          Select Your Role
        </Typography>
        <Carousel>
          <CarouselTrack ref={trackRef}>
            {cardsData.map((item, index) => (
              <CarouselCard key={index} ref={addToRefs}>
                <Card elevation={0}>
                  <CardActionArea onClick={() => navigate(item.path)}>
                    <CardContent style={{ textAlign: 'center' }}>
                      {item.icon}
                      <Typography gutterBottom variant="h5" component="div" style={{ color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
                        {item.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </CarouselCard>
            ))}
          </CarouselTrack>
        </Carousel>
      </Container>
    </ThemeProvider>
  );
}

export default CardsPage;
