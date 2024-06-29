import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSpring, animated } from '@react-spring/web';
import BackgroundImage from './1.jpg';
// import LogoImage from './whatsapp-image-20240123-at-1705-1@2x.png';

const FullScreenWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: url(${BackgroundImage})  fixed;
  background-size: cover;
  position: relative;
  font-family: 'Open Sans', sans-serif;
`;

const GradientOverlay = styled(animated.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.7), rgba(146, 239, 253, 0.3));
  z-index: 1;
`;

const Content = styled(animated.div)`
  z-index: 10;
  padding: 2rem;
  width: auto;
  max-width: 640px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  // position: absolute;
  // top: 20%;
  // left: 55%;

  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  color: #007bff;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 0.5rem;
`;

const SubHeading = styled.h2`
  font-size: 1.8rem;
  color: #343a40;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  font-size: 1.3rem;
  padding: 1rem 1.5rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

function HomePage() {
  const navigate = useNavigate();
  const fade = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 300 });
  const slideUp = useSpring({ to: { opacity: 1, transform: 'translateY(0)' }, from: { opacity: 0, transform: 'translateY(40px)' }, delay: 500 });

  return (
    <FullScreenWrapper>
      <GradientOverlay style={fade} />
      <Content style={slideUp}>
        <img src='/logo.png' alt="CRM Logo" style={{ width: 120, height: 120, borderRadius:'20px' ,marginBottom: '1rem' }} />
        <Heading>Welcome to  CRM</Heading>
        <SubHeading>Explore the new dimension of customer management</SubHeading>
        <StartButton onClick={() => navigate('/crmlogin')}>Let's Start</StartButton>
      </Content>
    </FullScreenWrapper>
  );
}

export default HomePage;
