import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Header from '../side/header';
function RegisterAdmin() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmpassword: ''
    });
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const [isSidebar, setIsSidebar] = useState(true);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.confirmpassword) {
            setMessage('Error: Passwords do not match.');
            setSeverity('error');
            return;
        }

        setMessage('');
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/addadmin/register-admin`, {
                id: formData.id,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmpassword: formData.confirmpassword

            });
            setMessage('Admin registered successfully.');
            setSeverity('success');
        } catch (error) {
            setMessage('Error during registration: ' + (error.response ? error.response.data : error.message));
            setSeverity('error');
        }
    };

    return (
        <div className="app">
      <main className="content" style={{}}>
      <Box sx={{ marginLeft: '20px' }}>
        <Header title="Add Admin" subtitle="" />
        </Box> 
        <Container maxWidth="sm">
        
            <form onSubmit={handleSubmit}>
                <TextField
                    label="ID"
                    variant="outlined"
                    fullWidth
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="confirmpassword"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Box mt={2}>
                <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<PersonAddIcon />}
        sx={{
            width: 200, // sets the width to 200 pixels
        maxWidth: '80%', // ensures the button does not exceed 80% of its container width
            backgroundColor: '#1565c0', // Custom color
            '&:hover': {
                backgroundColor: '#0d47a1', // Darker blue on hover
                transform: 'scale(1.05)', // Scale up effect on hover
            },
            padding: '10px 20px ',
            marginLfte : '170px',
            borderRadius: '8px',
            transition: 'transform 0.2s, background-color 0.2s', // Transition for smooth effects
        }}
    >
        Register
    </Button>
                </Box>
            </form>
            {message && (
                <Box mt={2}>
                    <Alert severity={severity}>{message}</Alert>
                </Box>
            )}
        </Container>
        </main>
        </div>
    );
}

export default RegisterAdmin;
