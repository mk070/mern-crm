import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box,Toolbar,Typography } from '@mui/material';
import logoImage from './whatsapp-image-20240123-at-1705-1@2x.png'; 
import BackgroundImage from '../home/1.jpg'
import styled from 'styled-components';

const AnimatedBackground = styled.div`
		min-height: 100vh;background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;background-size: cover;`;

const commonCategories = [
  'Accounting Software',
  'Customer Relationship Management (CRM)',
  'Enterprise Resource Planning (ERP)',
  'Project Management Software',
  'Business Intelligence (BI) Software',
  'Human Resource Management (HRM) Software',
  'Content Management System (CMS)',
  'E-commerce Platform',
  'Data Analytics Software',
  'Cybersecurity Software',
  'Other'
];
const StartButton = styled.button`
  font-size: 1.0rem;
  padding: 1rem 2.8rem;
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

const ProductForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/product', { name, code, description, category, price });
      navigate('/userlogin');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <AnimatedBackground>
        <Toolbar>
			  <img src='/logo.png' alt="Logo" style={{ height: '88px',borderRadius:'20px' ,marginTop: '10px',}} />
			</Toolbar>
            <Typography 
                        component="h1" 
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',   // Make the font bold
                            color: 'black' ,
                            textAlign:'center'       // Set the text color to black
                        }}
                    >
                        Submit Your Product Details
                    </Typography>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '80%', // Adjust the width as needed
        margin: '0 auto', // Center the form horizontally
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'30px'
      }}
    >
      <TextField
        label="Product Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        InputLabelProps={{ style: { color: 'black' } }}
        required
        sx={{ marginBottom: '16px', width: '30%' }}
      />
      <TextField
        label="Product Code"
        variant="outlined"
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        InputLabelProps={{ style: { color: 'black' } }}
        required
        sx={{ marginBottom: '16px', width: '30%' }}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        InputLabelProps={{ style: { color: 'black' } }}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginBottom: '16px', width: '30%' }}
      />
      <FormControl variant="outlined" fullWidth sx={{ marginBottom: '16px', width: '30%' }}>
        <InputLabel>Select Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          label="Select Category"
          InputLabelProps={{ style: { color: 'black' } }}
          required
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {commonCategories.map((cat, index) => (
            <MenuItem key={index} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Price"
        variant="outlined"
        fullWidth
        type="number"
        value={price}
        InputLabelProps={{ style: { color: 'black' } }}
        onChange={(e) => setPrice(e.target.value)}
        required
        sx={{ marginBottom: '16px', width: '30%' }}
      />
      <StartButton type="submit" variant="contained" color="primary" sx={{ width: '10%' }}>Submit</StartButton>
    </Box>
    </AnimatedBackground>
  );
};

export default ProductForm;
