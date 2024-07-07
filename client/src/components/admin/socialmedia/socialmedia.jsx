import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../side/header'; // Adjusted to correct filename casing
import Side from '../side/side'; // Adjusted to correct filename casing
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { LinkedIn } from '@mui/icons-material';

const SocialMedia = () => {
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <div className="app">
            <Side isSidebar={isSidebar} />

            <main className="content">
                <Header title="Projects" subtitle="Manage your social media posts and engagement"  />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        margin: '50px 40px', // Center the form horizontally
                        // border: "1px solid black"
                        gap:'20px'
                    }}
                >
                        <Box component={Link} to={'/x'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',gap:'20px' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"gray", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'blue'}
                            }}>
                                <XIcon  sx={{ fontSize: 40 }} />
                                <Typography variant='h5'>X</Typography>
                        </Box>
                        <Box component={Link} to={'/instagram'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',gap:'20px' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"gray", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'blue'}
                            }}>
                                <InstagramIcon sx={{ fontSize: 40 }}  />
                                <Typography variant='h5'>Instagram</Typography>
                        </Box>
                        <Box component={Link} to={'/facebook'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',gap:'20px' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"gray", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'blue'}
                            }}>
                                <FacebookIcon  sx={{ fontSize: 40 }} />
                                <Typography variant='h5'>Facebook</Typography>
                        </Box>
                        <Box component={Link} to={'/linkedin'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',gap:'20px' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"gray", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'blue'}
                            }}>
                                <LinkedIn sx={{ fontSize: 40 }}  />
                                <Typography variant='h5'>LinkedIn</Typography>
                        </Box>
                </Box>
            </main>
        </div>
    );
};

export default SocialMedia;
