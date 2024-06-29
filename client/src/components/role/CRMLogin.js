import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, Container, ThemeProvider, createTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import styled, { keyframes } from 'styled-components';
import { gsap } from 'gsap';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(270deg, #ff9a9e, #fad0c4, #fad0c4, #ff9a9e);
  background-size: 800% 800%;
  animation: ${gradientAnimation} 15s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto Condensed", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
  },
});

const cardsData = [
  // { title: 'CLIENT', path: '/userlogin', icon: <AccountCircleIcon style={{ fontSize: 70, color: 'black' }} /> },
  { title: 'ADMIN', path: '/adminlogin', icon: <AdminPanelSettingsIcon style={{ fontSize: 70, color: 'black' }} /> },
  { title: 'EMPLOYEE', path: '/employeelogin', icon: <WorkIcon style={{ fontSize: 70, color: 'black' }} /> },
];

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
    <ThemeProvider theme={theme} >
      <AnimatedBackground>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <img src='/logo.png' alt="Logo" style={{ height: '88px', borderRadius: '20px', marginTop: '10px' }} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" style={{ paddingTop: 50, paddingBottom: 50, height: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h3" align="center" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
            Select Your Role
          </Typography>
          <Carousel>
            <CarouselTrack ref={trackRef}>
              {cardsData.map((item, index) => (
                <CarouselCard key={index} ref={addToRefs}>
                  <Card
                    elevation={0}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '250px',
                      width: '100%',
                    }}
                  >
                    <CardActionArea onClick={() => navigate(item.path)} style={{ width: '100%', height: '100%' }}>
                      <CardContent style={{ textAlign: 'center' }}>
                        {item.icon}
                        <Typography gutterBottom variant="h5" component="div" style={{ color: 'black', fontWeight: 'bold', marginTop: '20px' }}>
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
      </AnimatedBackground>
    </ThemeProvider>
  );
}

export default CardsPage;
