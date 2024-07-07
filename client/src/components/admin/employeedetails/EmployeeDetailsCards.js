import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  Dialog,
  CardActions,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddTaskIcon from '@mui/icons-material/AddTask';
import image from './employee.png';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  maxWidth: 300,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
}));

const AssignButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    justifyContent: 'space-between',
  },
}));

function EmployeeDetailsCards({ data }) {
  const [taskInput, setTaskInput] = useState({});
  const [open, setOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDialogOpen = (id) => {
    setCurrentEmployeeId(id);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setCurrentEmployeeId(null);
    setTaskInput({});
  };

  const handleChangeTaskInput = (id, type, value) => {
    setTaskInput((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: value,
      },
    }));
  };

  const handleAddTask = (id, type) => {
    const inputKey = type + 'Input';
    const newTask = taskInput[id]?.[inputKey]?.trim();
    if (newTask) {
      const updatedTasks = taskInput[id]?.[type] ? [...taskInput[id][type], newTask] : [newTask];
      setTaskInput((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [type]: updatedTasks,
          [inputKey]: '',
        },
      }));
    }
  };

  const saveTask = () => {
    const tasksToSave = taskInput[currentEmployeeId];

    if (!tasksToSave) {
      console.error('No tasks to save');
      return;
    }

    const { todo = [], followUp = [] } = tasksToSave;

    if (!todo.length && !followUp.length) {
      console.error('Tasks cannot be empty');
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
        followUps: JSON.stringify(followUp),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save tasks');
        }
        console.log('Tasks saved successfully');
        setSnackbarMessage('Tasks saved successfully');
        setSnackbarOpen(true);
        handleDialogClose();
      })
      .catch((error) => {
        console.error('Error saving tasks:', error);
        setSnackbarMessage('Error saving tasks');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <StyledCard>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {item.email}
                </Typography>
              </CardContent>
              <CardActions>
                <AssignButton
                  startIcon={<AddTaskIcon />}
                  onClick={() => handleDialogOpen(item._id)}
                >
                  Assign Task
                </AssignButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <StyledDialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Assign Tasks</DialogTitle>
        <DialogContent>
          <TextField
            value={taskInput[currentEmployeeId]?.todoInput || ''}
            onChange={(e) =>
              handleChangeTaskInput(currentEmployeeId, 'todoInput', e.target.value)
            }
            margin="dense"
            label="Add a new task"
            type="text"
            fullWidth
          />
          <Button
            onClick={() => handleAddTask(currentEmployeeId, 'todo')}
            color="primary"
            variant="contained"
            fullWidth
            style={{ marginTop: 10 }}
          >
            Add
          </Button>
          <List>
            {taskInput[currentEmployeeId]?.todo?.map((task, index) => (
              <ListItem key={index}>{task}</ListItem>
            ))}
          </List>
          <TextField
            value={taskInput[currentEmployeeId]?.followUpInput || ''}
            onChange={(e) =>
              handleChangeTaskInput(currentEmployeeId, 'followUpInput', e.target.value)
            }
            margin="dense"
            label="Add a new follow-up"
            type="text"
            fullWidth
            style={{ marginTop: 20 }}
          />
          <Button
            onClick={() => handleAddTask(currentEmployeeId, 'followUp')}
            color="primary"
            variant="contained"
            fullWidth
            style={{ marginTop: 10 }}
          >
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button color="secondary" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </>
  );
}

export default EmployeeDetailsCards;
