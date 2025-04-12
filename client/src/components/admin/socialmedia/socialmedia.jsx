import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../side/header'; // Adjusted to correct filename casing
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { LinkedIn } from '@mui/icons-material';

const SocialMedia = () => {
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <div className="app">
           
            <main className="content" style={{}}>
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
                        <Box component={Link} to={'/socialmedia/x'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',boxShadow:"2px 2px 2px 1px",scale:"1" ,gap:'20px',border:'2px solid black' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none',  color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'aliceblue',scale:'1.08',}
                            }}>
                                <XIcon  sx={{ fontSize: 40,color:"red" }} />
                                <Typography variant='h5'>X</Typography>
                        </Box>
                        <Box component={Link} to={'/socialmedia/instagram'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',boxShadow:"2px 2px 2px 1px",gap:'20px',border:'2px solid black' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'aliceblue',scale:'1.08'}
                            }}>
                                <InstagramIcon sx={{ fontSize: 40 ,color:'palevioletred'}}  />
                                <Typography variant='h5'>Instagram</Typography>
                        </Box>
                        <Box component={Link} to={'/socialmedia/facebook'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',boxShadow:"2px 2px 2px 1px",gap:'20px',border:'2px solid black' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'aliceblue',scale:'1.08'}
                            }}>
                                <FacebookIcon  sx={{ fontSize: 40 ,color:'blueviolet'}} />
                                <Typography variant='h5'>Facebook</Typography>
                        </Box>
                        <Box component={Link} to={'/socialmedia/linkedin'} 
                            sx={{padding:'20px 60px' ,borderRadius:'20px',boxShadow:"2px 2px 2px 1px",gap:'20px',border:'2px solid black' ,display:'flex',justifyContent:'center',alignItems:"center",flexDirection:"column", textDecoration: 'none', bgcolor:"", color:'black',transition:"0.5s ease-in-out",
                                '&:hover':{ bgcolor:'aliceblue',scale:'1.08'}
                            }}>
                                <LinkedIn sx={{ fontSize: 40 ,color:'blue'}}  />
                                <Typography variant='h5'>LinkedIn</Typography>
                        </Box>
                </Box>
            </main>
        </div>
    );
};

export default SocialMedia;
