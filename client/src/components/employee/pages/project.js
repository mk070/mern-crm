import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import styled from 'styled-components';
import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg'
const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;


const backgroundStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8))',
  backgroundImage: `url(${BackgroundImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
};

const tableContainerStyle = {
  borderRadius: '4px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

const ProjectDetails = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch the user data from local storage
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          // Assuming user ID is stored as '_id' in user object
          const userId = user._id;

          // Fetch projects associated with the user ID
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/project/assigned-projects/${userId}`);
          setProjects(response.data);
        }
      } catch (error) {
        setError('Error fetching projects: ' + error.message);
      }
    };

    fetchProjects(); // Call the fetchProjects function when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  // Function to format dates in 'YYYY-MM-DD' format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  return (
    <>
      <AnimatedBackground>
        <Navbar />
        <Container maxWidth="md">
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer component={Paper} style={tableContainerStyle}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Work</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Budget</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{formatDate(project.startDate)}</TableCell>
                    <TableCell>{formatDate(project.endDate)}</TableCell>
                    <TableCell>{project.work}</TableCell>
                    <TableCell>{project.priority}</TableCell>
                    <TableCell>{project.budget}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        </AnimatedBackground>
    </>
  );
};

export default ProjectDetails;
