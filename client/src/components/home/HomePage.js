import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';

const FullScreenWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f9; /* Salesforce-like background color */
  font-family: 'Salesforce Sans', Arial, sans-serif;
`;

const Content = styled.div`
  padding: 2rem;
  width: auto;
  max-width: 640px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  color: #0070d2;
  margin-bottom: 0.5rem;
`;

const SubHeading = styled.h2`
  font-size: 1.8rem;
  color: #4b4b4b;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  font-size: 1.3rem;
  padding: 1rem 1.5rem;
  color: white;
  background-color: #0070d2;
  border: none;
  border-radius: 5px;
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

  return (
    <FullScreenWrapper>
      <Content>
        <img src='/logo.png' alt="CRM Logo" style={{ width: 120, height: 120, marginBottom: '1rem' }} />
        <Heading>Welcome to CRM</Heading>
        <SubHeading>Explore the new dimension of customer management</SubHeading>
        <StartButton onClick={() => navigate('/crmlogin')}>Let's Start</StartButton>
      </Content>
    </FullScreenWrapper>
  );
}

export default HomePage;
