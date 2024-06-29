import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, LineChart, Line } from 'recharts';

import Side from '../side/side';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)`
  margin: 5px 20px;
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

function Count() {
  const [userCount, setUserCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/count`);
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setError('Failed to fetch user count');
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/clientcount`);
        setClientCount(response.data.clientCount);
      } catch (error) {
        console.error('Error fetching client count:', error);
        setError('Failed to fetch client count');
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount`);
        setTaskCount(response.data.taskCount);
      } catch (error) {
        console.error('Error fetching task count:', error);
        setError('Failed to fetch task count');
      }

     
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount/leadcount`);
        setLeadCount(response.data.leadCount);
      } catch (error) {
        console.error('Error fetching task count:', error);
        setError('Failed to fetch task count');
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/taskcount/querycount`);
        setQueryCount(response.data.queryCount);
      } catch (error) {
        console.error('Error fetching task count:', error);
        setError('Failed to fetch task count');
      }
      
   
  

      setLoading(false);
    };

    fetchData();
  }, []);

  const data = [
    { name: 'Employee', count: userCount },
    { name: 'Client', count: clientCount },
    { name: 'Task', count: taskCount },
    { name: 'Lead', count: leadCount },
    // {name:'Query', count: queryCount}
   
    
  ];
  const pieData = [
    { name: 'Employee', value: userCount },
    { name: 'Client', value: clientCount },
    { name: 'Task', value: taskCount },
    { name: 'Lead', value: leadCount },
    // { name:'Query', value: queryCount}
  ];
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="app" style={{overflow:'hidden'}}>
        <Side isSidebar={isSidebar}/>
        <main className="content">
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              padding: '10px',
              position: 'relative',
              top: '40px',
              left: '20px',
              minHeight: '10vh'
            }}
          >
            <StyledCard>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} >
                  Employee Count
                </Typography>
                <Typography variant="h5" component="div">
                  {userCount}
                </Typography>
              </CardContent>
            </StyledCard>
            <StyledCard>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom>
                  Client Count
                </Typography>
                <Typography variant="h5" component="div">
                  {clientCount}
                </Typography>
              </CardContent>
            </StyledCard>
            <StyledCard>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom>
                  Task Count
                </Typography>
                <Typography variant="h5" component="div">
                  {taskCount}
                </Typography>
              </CardContent>
            </StyledCard>
            <StyledCard>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom>
                  Lead Count
                </Typography>
                <Typography variant="h5" component="div">
                  {leadCount}
                </Typography>
              </CardContent>
            </StyledCard>
            {/* <StyledCard>
              <CardContent>
                <Typography sx={{ fontSize: 20 }} gutterBottom>
                  Query count
                </Typography>
                <Typography variant="h5" component="div">
                  {queryCount}
                </Typography>
              </CardContent>
            </StyledCard> */}
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'row', gap: '5px', marginTop: '150px',marginLeft: '0px',width:"90%" }}>
            <ResponsiveContainer width="30%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="30%" height={200}>
              <PieChart>
                <Pie dataKey="value" isAnimationActive={true} data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="40%" height={200}>
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Box>
          
        </main>
      </div>
    </>
  );
  
}

export default Count;
