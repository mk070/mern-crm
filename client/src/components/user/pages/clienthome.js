import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ClientNavbar from '../clientnavbar';
import BackgroundImage from '../../home/1.jpg'
import ProfileImage from './teamwork.png';
const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 60px;
  padding: 60px 20px;
  text-align: center;
  color: #fff;
`;

const ContentTitle = styled.h1`
  font-size: 4.5em;
  font-family: 'Roboto Condensed', sans-serif;
  margin-bottom: 30px;
  font-weight: bold;
  color: black;
  overflow: hidden; /* Ensure text overflow is hidden */
  white-space: nowrap; /* Prevent line breaks */
`;

const ContentText = styled.p`
  font-size: 2.2em;
  font-family: 'Roboto Condensed', sans-serif;
  color: black;
  line-height: 1.6;

`;
const ProfileImageContainer = styled.div`
  width: 40%;
  margin-left: 1000px;
  margin-top:-300px;
`;
const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const typingAnimation = keyframes`
  from {
    width: 0; /* Start with zero width */
  }
  to {
    width: 100%; /* Expand to full width */
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedTitle = styled(ContentTitle)`
  display: inline-block;
  overflow: hidden;

  span {
    display: inline-block;
    opacity: 0;
    animation: ${fadeIn} 0.5s forwards;
    animation-delay: calc(0.1s * var(--index));
    margin-right: 0.2em; /* Add space between characters */
  }
`;



function ClientHome() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('client');
    if (userData) {
      setClient(JSON.parse(userData));
      console.log("Client data retrieved from localStorage:", JSON.parse(userData));
    }
  }, []);

 
  if (!client) {
    console.log("Client data not available yet:", client);
    return <div>Loading user data...</div>;
  }
  console.log("Client data available:", client);

  return (
    <>
      <AnimatedBackground>
        <ClientNavbar />
        <ContentContainer>
          <AnimatedTitle className="animated-title">
            {Array.from('Welcome  ' + client.name).map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </AnimatedTitle>
          <ContentText>
             This is where you can view your profile.
          </ContentText>
          <ProfileImageContainer>
          <Image src={ProfileImage} alt="Profile" />
        </ProfileImageContainer>
          
        </ContentContainer>
      </AnimatedBackground>
    </>
  );
}

export default ClientHome;
