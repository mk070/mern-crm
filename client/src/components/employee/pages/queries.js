import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg'

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;
const ContentText = styled.p`
  font-size: 2.2em;
  font-family: 'Roboto Condensed', sans-serif;
  color: black;
  line-height: 1.6;

`;

const QueryForm = ({ setQueries }) => {
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setMessage('Please enter a query.');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/query`, { query });
      setMessage('Query submitted successfully!');
      setQuery('');
    } catch (error) {
      console.error(error);
      setMessage('Failed to submit query. Please try again later.');
    }
  };

  return (
    <AnimatedBackground>
      <Navbar />
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
      <Grid item xs={12} sm={8} style={{ textAlign: 'center', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
      
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} sm={4}> {/* Adjusted the size of the input field for smaller screens */}
            <TextField
              fullWidth
              label="Enter your query"
              variant="outlined"
              value={query}
              InputLabelProps={{ style: { color: 'black' } }}
              style={{ marginLeft: '300px' }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" type="submit" style={{ marginLeft: '300px' }}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color={message.startsWith('Failed') ? 'error' : 'success'}>
              {message}
            </Typography>
            <ContentText>
             Add your queries here..!
          </ContentText>
          </Grid>
        </Grid>
      </form>
      </Grid>
      </Grid>
    </AnimatedBackground>
  );
};

export default QueryForm;
