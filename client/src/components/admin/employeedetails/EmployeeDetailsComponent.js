import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeDetailsCards from './EmployeeDetailsCards';
import Header from '../side/header'; // Adjust import path as per your project structure
import { Box, CircularProgress, Typography, Grid } from '@mui/material';

function EmployeeDetailsComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebar, setIsSidebar] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/details/details`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <div className="app">
         
            <main className="content" style={{marginLeft:"270px"}}>
                <Box m="20px">
                    <Header title="Employee Details" subtitle="" />
                    <Grid container spacing={3}>
                        <EmployeeDetailsCards data={data} />
                    </Grid>
                </Box>
            </main>
        </div>
    );
}

export default EmployeeDetailsComponent;
