import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetailsCards from './UserDetailsCards';
import Side from '../side/side';
import Header from '../side/header';
import { Box } from '@mui/material';
import './team.css';
function UserDetailsComponent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebar, setIsSidebar] = useState(true);


 useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userdetails/userdetails`);
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

if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

 return (
        <>
        <div className="app">
         <Side isSidebar={isSidebar}/>
        <main className="content">
        
        <Box sx={{ marginLeft: '20px' }}>
        <Header title="Client Details" subtitle="" />
        </Box> 
            <UserDetailsCards data={data} />
        
        </main>
        </div>
     </>
    );
}

export default UserDetailsComponent;
