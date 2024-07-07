import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import axios from 'axios';

const X = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        // Fetch existing X posts from your backend
        axios.get(`${process.env.REACT_APP_API_URL}/api/social/X/posts`)
            .then(response => setPosts(response.data))
            .catch(error => console.error('Error fetching X posts:', error));
    }, []);

    const handlePost = () => {
        // Send new post to your backend
        axios.post(`${process.env.REACT_APP_API_URL}/api/social/X/post`, { content: newPost })
            .then(response => setPosts([response.data, ...posts]))
            .catch(error => console.error('Error posting to X:', error));
    };

    return (
        <Box>
            <Typography variant="h4">X</Typography>
            <TextField
                label="New Tweet"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handlePost}>Post</Button>
            <Box>
                {posts.map(post => (
                    <Box key={post.id} sx={{ marginTop: 2 }}>
                        <Typography>{post.content}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default X;
