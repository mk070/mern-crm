import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import BackgroundImage from '../../home/1.jpg';
// import logoImage from '../whatsapp-image-20240123-at-1705-1@2x.png'; 
import { TextField, Button, Typography, Box, Container, Grid, CssBaseline,AppBar, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';
const theme = createTheme({
    palette: {
        primary: {
            main: '#5e35b1', // Choose your color
        },
        secondary: {
            main: '#ff1744', // Choose your color
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none', // Buttons have normal casing, not uppercase
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8, // Rounded buttons
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    margin: (theme) =>theme.spacing(1, 0),
                },
            },
        },
    },
});
const StartButton = styled.button`
  font-size: 1.0rem;
  padding: 0.5rem 2.3rem;
  color: white;
 margin-top: 10px;
 margin-left:160px;
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
const AnimatedBackground = styled.div`
		min-height: 100vh;background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;background-size: cover;`;

function OtherDetails() {
    const [details, setDetails] = useState({
        dob: null,
        position: '',
        doj: null,
        contact: ''
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setDetails(prevDetails => ({
            ...prevDetails,
            [name]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        if (!details.dob || !details.position || !details.doj || !details.contact) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }
    
        try {
            const formattedDetails = {
                ...details,
                dob: details.dob.toISOString(),
                doj: details.doj.toISOString()
            };
            const response = await axios.post('http://localhost:5000/api/otherdetails', formattedDetails);
            console.log('Details submitted:', response.data);
            setError(null);
            navigate('/employeelogin');
        } catch (error) {
            console.error('Failed to submit details:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <AnimatedBackground>
		  <AppBar position="static" color="transparent" elevation={0}>
			<Toolbar>
                <img src='/logo.png' alt="Logo" style={{ height: '88px', borderRadius:'20px' ,marginTop: '10px'}} />
			</Toolbar>
		  </AppBar>
            <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                        sx={{
                            marginTop: 5,
                            marginLeft: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 3,
                            p: 1,
                            borderRadius: 8,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'visible',
                            transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s',
                            '&:hover': {
                                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                transform: 'translateY(-4px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                    >
                    <Typography 
                        component="h1" 
                        variant="h5"
                        sx={{
                            fontWeight: 'bold',   // Make the font bold
                            color: 'black'        // Set the text color to black
                        }}
                    >
                        Submit Your Details
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={6} md={5}>
                                <DatePicker
                                    selected={details.dob}
                                    onChange={(date) => handleDateChange('dob', date)}
                                    dateFormat="MM/dd/yyyy"
                                    wrapperClassName="datePickerWrapper"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="scroll"
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={60} // Custom wrapper class
                                    customInput={<TextField fullWidth required label="Date of Birth"/>}
                                    portalId="root-portal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={5}>
                                <DatePicker
                                    selected={details.doj}
                                    onChange={(date) => handleDateChange('doj', date)}
                                    dateFormat="MM/dd/yyyy"
                                    wrapperClassName="datePickerWrapper" 
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="scroll"
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={60}// Custom wrapper class
                                    customInput={<TextField fullWidth required label="Date of Joining"/>}
                                    portalId="root-portal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={5}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Position"
                                    name="position"
                                    sx={{ maxWidth: '210px' }}
                                    value={details.position}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={5}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Contact Number"
                                    name="contact"
                                    sx={{ maxWidth: '210px' }}
                                    value={details.contact}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                        <StartButton
                            type="submit"
                            
                            disabled={isLoading}
                            
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </StartButton>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
        </AnimatedBackground>
    );
}

export default OtherDetails;
