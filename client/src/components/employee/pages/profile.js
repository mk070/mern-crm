import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg'

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

const ProfileCard = styled.div`
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    text-align: center;
`;

const ProfileTitle = styled.h1`
    margin-bottom: 20px;
    color: #555;
`;

const ProfileInfo = styled.p`
    margin-bottom: 10px;
`;

function Profile() {
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
        <>
            <AnimatedBackground>
                <Navbar />
                <ProfileCard>
                    
                    <ProfileInfo><strong>ID:</strong> {user.id}</ProfileInfo>
                    <ProfileInfo><strong>Name:</strong> {user.name}</ProfileInfo>
                    <ProfileInfo><strong>Email:</strong> {user.email}</ProfileInfo>
                </ProfileCard>
            </AnimatedBackground>
        </>
    );
}

export default Profile;
