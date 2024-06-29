import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, CardMedia, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';

import image from './employee.png';

const StyledCard = styled(Card)`
  margin: 10px 50px;
  width: 200px;
  bottom: 300px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: 0.3s;
  box-shadow 0.3s;
  background-color: #f5f5f5;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
`;

function UserDetailsCards({ data }) {
    const [expandedId, setExpandedId] = useState(null);

    const handleExpandClick = (id) => {
        setExpandedId(expandedId === id ? null : id);  // Toggle expanded card
    };

    return (
        <Grid container spacing={0}>
            {data.map((item) => (
                <Grid item key={item._id} xs={4} sm={4} md={2.7}>
                    <StyledCard>
                        <CardMedia
                            component="img"
                            style={{ width: 80, height: 70, objectFit: 'fill' }}
                            image={image}
                            alt={item.name}
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {item.email}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton
                                onClick={() => handleExpandClick(item._id)}
                                aria-expanded={expandedId === item._id}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </CardActions>
                        <Collapse in={expandedId === item._id} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>Client Id: {item.id}</Typography>

                                {/* Add additional item details here */}
                            </CardContent>
                        </Collapse>
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
}

export default UserDetailsCards;
