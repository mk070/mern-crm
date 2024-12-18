import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Grid } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import axios from 'axios';
import Side from '../side/side';
import Header from '../side/header';

const Facebook = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [scheduledTime, setScheduledTime] = useState(new Date());

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const handlePost = (isScheduled) => {
        if (newPost.trim()) {
            const payload = {
                status: newPost,
                scheduledTime: isScheduled ? scheduledTime.toISOString() : null,
            };
            axios.post(`${process.env.REACT_APP_API_URL}/api/social/x/post`, payload)
                .then(response => {
                    setPosts([response.data, ...posts]);
                    notifySuccess(`Post ${isScheduled ? 'scheduled' : 'published'} successfully!`);
                })
                .catch(error => {
                    console.error('Error posting to X:', error);
                    notifyError('Failed to post');
                });
        } else {
            notifyError('Post content cannot be empty');
        }
    };

    const displayISTTime = (utcTime) => {
        return new Date(utcTime).toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
        });
    };

    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <div className="app">
            <Side isSidebar={isSidebar} />

            <main className="content" style={{padding:'30px 50px'}}>
                <Header title="Facebook" subtitle="Manage your Facebook posts"  />

                <Box sx={{ padding: 4 }}>
            {/* <Typography variant="h4" gutterBottom>X</Typography> */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="New Post"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Schedule Post"
                            value={scheduledTime}
                            onChange={(newValue) => setScheduledTime(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            timezone="UTC" // Ensure backend stores in UTC
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={6}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handlePost(false)} 
                            fullWidth
                            startIcon={<SendIcon />}
                        >
                            Post Now
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={() => handlePost(true)} 
                            fullWidth
                            startIcon={<ScheduleIcon />}
                        >
                            Schedule Post
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                        Scheduled Time: {scheduledTime ? displayISTTime(scheduledTime.toISOString()) : ''}
                    </Typography>
                </Grid>
            </Grid>
            <ToastContainer />
                </Box>
              
            </main>
        </div>
    );



  
};

export default Facebook;
