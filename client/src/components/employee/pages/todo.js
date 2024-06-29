import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AlarmIcon from '@mui/icons-material/Alarm';
import Navbar from '../Navbar'; 
import BackgroundImage from '../../home/1.jpg';

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

const ContainerStyled = styled(Container)`
  background-color: rgba(248, 249, 250, 0);
  padding: 60px;
  margin-top: 40px;
  font-family: Arial, sans-serif;
  border-radius: 10px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  }
  max-width: 1000px;
`;

const CardStyled = styled(Card)`
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ListStyled = styled(List)`
  padding: 0;
  align-items: flex-start;
`;

const ListItemStyled = styled(ListItem)`
  display: flex;
  align-items: center; /* Center items vertically */
  padding: 10px 0px;
  margin-left: 50px;
  height: 100%;
`;


function Task() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const { employeeId } = useParams();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setProfileId(user._id);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (profileId) {
          const response = await axios.get(`http://localhost:5000/api/task/${profileId}`);
          setTasks(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [profileId]);

  if (loading) {
    return <div className="text-center mt-5">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center mt-5">Error: {error.message}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center mt-5">No tasks available.</div>;
  }

  return (
    <>
      <AnimatedBackground>
        <Navbar />
        <ContainerStyled>
          <h1 className="text-center mb-4" style={{ fontWeight: 'bold' }}>Tasks  {employeeId}</h1>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <CardStyled>
                <CardContent>
                  <Typography variant="h5" component="h2" style={{ fontWeight: 'bold' }}>
                    To-Do:
                  </Typography>
                  <ListStyled>
                    {tasks.map(task => (
                      <ListItemStyled key={task._id}>
                        <CheckCircleIcon color="primary" fontSize="small" style={{ marginRight: '8px' }} />
                        <ListItemText>
                          {task.todo.map((todoItem, todoIndex) => (
                            <Typography key={todoIndex} variant="body1">
                              {todoItem}
                            </Typography>
                          ))}
                        </ListItemText>
                      </ListItemStyled>
                    ))}
                  </ListStyled>
                </CardContent>
              </CardStyled>
            </div>
            <div className="col-lg-6 mb-4">
              <CardStyled>
                <CardContent>
                  <Typography variant="h5" component="h2" style={{ fontWeight: 'bold' }}>
                    Follow Ups:
                  </Typography>
                  <ListStyled>
                    {tasks.map((task, index) => (
                      <ListItemStyled key={index}>
                        <AlarmIcon color="secondary" fontSize="small" style={{ marginRight: '10px' }} />
                        <ListItemText>
                          {task.followUps.map((followUpItem, followUpIndex) => (
                            <Typography key={followUpIndex} variant="body1" >
                              {followUpItem}
                            </Typography>
                          ))}
                        </ListItemText>
                      </ListItemStyled>
                    ))}
                  </ListStyled>
                </CardContent>
              </CardStyled>
            </div>
          </div>
        </ContainerStyled>
      </AnimatedBackground>
    </>
  );
}

export default Task;
