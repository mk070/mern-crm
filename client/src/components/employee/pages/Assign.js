import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Card, CardContent, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import styled from 'styled-components';
import { AccountCircle } from '@mui/icons-material';
import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg'


const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

function Assign() {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileId, setProfileId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setProfileId(user._id);
        }
    }, []);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                if (profileId) {
                    const response = await axios.get(`http://localhost:5000/api/assign/${profileId}`);
                    setEmployeeDetails(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
                setError('Failed to fetch employee details.');
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [profileId]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="body1" color="error">{error}</Typography>;

    if (!employeeDetails || !employeeDetails.assignedClients || employeeDetails.assignedClients.length === 0) {
        return <Typography variant="body1">No assigned clients found.</Typography>;
    }

    return (
        <>
        <AnimatedBackground>
        <Navbar />
        <Box display="flex" justifyContent="center" marginTop="20px">
            <Card style={{ maxWidth: '400px', margin: 'auto' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">Assigned Clients</Typography>
                    <List>
                        {employeeDetails.assignedClients.map(client => (
                            <div key={client._id}>
                                <ListItem>
                                    <AccountCircle style={{ marginRight: '10px' }} />
                                    <ListItemText primary={`${client.name} - ${client.email}`} />
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
        
        </AnimatedBackground>
       
        </>
    );
}

export default Assign;
