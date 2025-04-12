import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Grid, InputLabel, Input, FormControl, FormControlLabel, RadioGroup, Radio, IconButton, CircularProgress, Backdrop, Tooltip } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';
import Header from '../side/header';
import ScheduledPost from './ScheduledPost'; // Import the new component

const Instagram = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [scheduledTime, setScheduledTime] = useState(new Date());
    const [generatecaption, setgeneratecaption] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(true);
    const [mediaFile, setMediaFile] = useState(null);
    const [postType, setPostType] = useState('post');
    const [loading, setLoading] = useState(false);
    const [captionLoading, setcaptionLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenTooltip(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const handlePost = (isScheduled) => {
        if (newPost.trim() && mediaFile) {
            const formData = new FormData();
            formData.append('caption', newPost);
            formData.append('media', mediaFile);
            formData.append('postType', postType);
            if (isScheduled) {
                formData.append('scheduledTime', scheduledTime.toISOString());
            }

            setLoading(true);
            axios.post(`${process.env.REACT_APP_API_URL}/api/social/instagram/post/create-post`, formData)
                .then(response => {
                    setPosts([response.data, ...posts]);
                    notifySuccess(`${postType} ${isScheduled ? 'scheduled' : 'posted'} successfully!`);
                })
                .catch(error => {
                    const errorMessage = error.response && error.response.data ? error.response.data.message : `Failed to ${isScheduled ? 'schedule' : 'post'}`;
                    console.error(`Error ${isScheduled ? 'scheduling' : 'posting'} to Instagram:`, error);
                    notifyError(errorMessage);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            notifyError('Post content and media cannot be empty');
        }
    };

    const fetchAICaption = async () => {
        setcaptionLoading(true);
        try {
            const formData = new FormData();
            setgeneratecaption(true);
            formData.append('media', mediaFile);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/social/instagram/post/generatecaption`, formData);
            setNewPost(response.data.caption);
            notifySuccess('AI-generated caption fetched successfully!');
        } catch (error) {
            console.error('Error fetching AI-generated caption:', error);
            notifyError('Failed to fetch AI-generated caption');
        } finally {
            setcaptionLoading(false);
        }
    };

    const [isSidebar, setIsSidebar] = useState(true);

    const shineEffect = `
        .spark-animation {
            animation: color-change 3s infinite alternate;
        }

        @keyframes color-change {
            0% {
                color: #3366ff; 
            }
            30%{
                color:#c61aff
            }
            60%{
                color:#ff0080
            }
            100% {
                color: #aaff00;
            }
        }
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${shineEffect}</style>`);

    return (
        <div className="app">
           

            <main className="content" style={{ marginLeft:"240px",padding: '30px 50px' }}>
                <Header title="Instagram" subtitle="Manage your Instagram posts" />

                <Box sx={{ padding: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6"></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="media-upload" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '1.2em' }}>Upload Media</InputLabel>
                            <Box display="flex" alignItems="center">
                                <Input
                                    type="file"
                                    id="media-upload"
                                    accept={postType === 'reel' ? 'video/*' : 'image/*'}
                                    onChange={(e) => setMediaFile(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <TextField
                                    value={mediaFile ? mediaFile.name : ''}
                                    placeholder="No file chosen"
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                />
                                <Button
                                    variant="contained"
                                    component="label"
                                    color="primary"
                                    htmlFor="media-upload"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Upload
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} container alignItems="center" spacing={1}>
                            <Grid item xs={11}>
                                <TextField
                                    label="Caption"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    InputProps={{
                                        endAdornment: (
                                            <Tooltip
                                                title="Click to generate an AI-generated caption based on the uploaded media"
                                                open={openTooltip}
                                                PopperProps={{
                                                    disablePortal: true,
                                                }}
                                                onClose={() => setOpenTooltip(false)}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                arrow
                                            >
                                                <IconButton onClick={() => fetchAICaption(true)} disabled={captionLoading && mediaFile}>
                                                    <AutoAwesomeIcon style={{ fontSize: '32px' }} className={captionLoading ? 'spark-animation' : ''} />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    value={postType}
                                    onChange={(e) => setPostType(e.target.value)}
                                >
                                    <FormControlLabel value="reel" control={<Radio />} label="Reel" />
                                    <FormControlLabel value="story" control={<Radio />} label="Story" />
                                    <FormControlLabel value="post" control={<Radio />} label="Post" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Schedule Time"
                                    value={scheduledTime}
                                    onChange={(newValue) => setScheduledTime(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                    timezone="UTC"
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePost(true)}
                                    fullWidth
                                    startIcon={<ScheduleIcon />}
                                    disabled={loading}
                                >
                                    Schedule
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handlePost(false)}
                                    fullWidth
                                    startIcon={<SendIcon />}
                                    disabled={loading}
                                >
                                    Post Now
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <CircularProgress color="inherit" />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            Please wait, we are processing...
                        </Typography>
                    </Backdrop>
                    <ToastContainer />
                </Box>

                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Scheduled Posts
                    </Typography>
                    <Grid container spacing={4}>
                        {posts.map((post) => (
                            <ScheduledPost key={post.id} post={post} />
                        ))}
                    </Grid>
                </Box>
            </main>
        </div>
    );
};

export default Instagram;
