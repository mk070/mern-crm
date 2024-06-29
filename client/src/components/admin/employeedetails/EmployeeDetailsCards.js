import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, CardMedia, TextField, List, ListItem, Box} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';


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
const AssignButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Box shadow for the entire dialog
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        transition: 'background-color 0.3s ease', // Smooth transition for background color
        '&:hover': {
            backgroundColor: theme.palette.action.hover // Background color on hover
        }
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        '& button': { // Applying styles to buttons in the actions area
            transition: 'transform 0.2s ease-in-out', // Smooth transition for transform
            '&:hover': {
                transform: 'scale(1.05)', // Scale effect on hover for buttons
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)' // Shadow for hovered buttons
            }
        }
    }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



function EmployeeDetailsCards({ data }) {
    const [expandedId, setExpandedId] = useState(null);
    const [taskInput, setTaskInput] = useState({});
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(true);  // Assuming dialog is open by default

    const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

    const handleExpandClick = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDialogOpen = (id) => {
        setCurrentEmployeeId(id);
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setCurrentEmployeeId(null);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleChangeTaskInput = (id, type, value) => {
        const inputKey = type + 'Input';  // Correct key for either todoInput or followUpInput
        setTaskInput(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [inputKey]: value
            }
        }));
    };
    
    const handleAddTask = (id, type) => {
        const inputKey = type + 'Input';
        const newTask = taskInput[id] && taskInput[id][inputKey].trim();
        if (newTask) {
            const updatedTasks = taskInput[id] && taskInput[id][type] ? [...taskInput[id][type], newTask] : [newTask];
            setTaskInput(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    [type]: updatedTasks,
                    [inputKey]: ''
                }
            }));
        } else {
            console.error('Empty input cannot be added.');
        }
    };
    
    const saveTask = () => {
      const tasksToSave = taskInput[currentEmployeeId];
    
      if (!tasksToSave) {
        console.error('No tasks to save');
        return;
      }
    
      const { todo, followUp } = tasksToSave;
    
      if (!Array.isArray(todo) || !todo.length || !Array.isArray(followUp) || !followUp.length) {
        console.error('todo and followUp must be non-empty arrays');
        return;
      }
    
      fetch(`${process.env.REACT_APP_API_URL}/api/task/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: currentEmployeeId,
          todo: JSON.stringify(todo),
          followUps: JSON.stringify(followUp)
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save tasks');
        }
        console.log('Tasks saved successfully');
        handleDialogClose();
      })
      .catch(error => console.error('Error saving tasks:', error));
    };
    
    
    
    
    
    return (
        <>
        <Grid container spacing={0}>
        {data.map((item) => (
          <React.Fragment key={item._id}>
            <Grid item xs={4} sm={4} md={2.7}>
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
                
                <AssignButton
                  startIcon={<AddTaskIcon />}
                  onClick={() => handleDialogOpen(item._id)}
                  size="small"
                >
                  Assign Task
                </AssignButton>
              </StyledCard>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
        {currentEmployeeId && (
         
                 <StyledDialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Assign Tasks</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">To-Do List</Typography>
                    <TextField
                        value={taskInput[currentEmployeeId]?.todoInput || ''}
                        onChange={(e) => handleChangeTaskInput(currentEmployeeId, 'todo', e.target.value)}
                        margin="dense"
                        label="Add a new task"
                        type="text"
                        fullWidth
                    />
                    <Button onClick={() => handleAddTask(currentEmployeeId, 'todo')} color="primary">
                        Add
                    </Button>
                    <List>
                        {taskInput[currentEmployeeId]?.todo?.map((task, index) => (
                            <ListItem key={index}>{task}</ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Follow Ups</Typography>
                    <TextField
                        value={taskInput[currentEmployeeId]?.followUpInput || ''}
                        onChange={(e) => handleChangeTaskInput(currentEmployeeId, 'followUp', e.target.value)}
                        margin="dense"
                        label="Add a new follow-up"
                        type="text"
                        fullWidth
                    />
                    <Button onClick={() => handleAddTask(currentEmployeeId, 'followUp')} color="primary">
                        Add
                    </Button>
                    <List>
                        {taskInput[currentEmployeeId]?.followUp?.map((task, index) => (
                            <ListItem key={index}>{task}</ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveTask} color="primary">
                        Save
                    </Button>
                </DialogActions>
                </StyledDialog>
          
            
        )}
        </>
    );
}

export default EmployeeDetailsCards;
