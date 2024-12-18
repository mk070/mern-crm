import React from 'react';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

const ScheduledPost = ({ post }) => {
    return (
        <Grid item xs={12} md={6} lg={4}>
            <Card>
                <CardMedia
                    component={post.mediaUrl.endsWith('.mp4') ? 'video' : 'img'}
                    image={post.mediaUrl}
                    title={post.caption}
                    controls
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {post.caption}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Scheduled Time: {new Date(post.scheduledTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Type: {post.postType}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ScheduledPost;
