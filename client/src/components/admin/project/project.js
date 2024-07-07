import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Snackbar, Box } from '@mui/material';
import Side from '../side/side';
import Header from '../side/header';

const AssignProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [work, setWork] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [budget, setBudget] = useState('');
  const [employees, setEmployees] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    // Fetch employees when component mounts
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/project/emp`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the selected employee object
      const selectedEmployee = employees.find(emp => emp._id === assignedEmployee);
      // Extract the _id of the selected employee
      const selectedEmployeeId = selectedEmployee ? selectedEmployee._id : null;
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/project/assign-project`, {
        projectName,
        projectDescription,
        assignedEmployee: selectedEmployeeId, // Pass the _id of the selected employee
        startDate,
        endDate,
        work,
        priority,
        budget
      });
      setSuccessMessage('Project assigned successfully');
      setOpenSnackbar(true);
      window.location.reload();
      // Optionally, you can redirect to another page after successful assignment
    } catch (error) {
      console.error('Error assigning project:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="app">
       <Side isSidebar={isSidebar}/>
      <main className="content">

      <Header  title="Projects" subtitle="" />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px', // Adjust the maximum width as needed
        margin: '0 auto', // Center the form horizontally
      }}
    >
      <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Project Description"
          variant="outlined"
          fullWidth
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
          style={{ marginBottom: '20px' }}
        />
        <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Select Employee</InputLabel>
          <Select
            value={assignedEmployee}
            onChange={(e) => setAssignedEmployee(e.target.value)}
            label="Select Employee"
            required
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {employees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <TextField
            label="Start Date"
            variant="outlined"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            style={{ width: '48%' }}
          />
          <TextField
            label="End Date"
            variant="outlined"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            style={{ width: '48%' }}
          />
        </div>

        <TextField
          label="Work"
          variant="outlined"
          fullWidth
          value={work}
          onChange={(e) => setWork(e.target.value)}
          required
          style={{ marginBottom: '20px' }}
        />
        <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            label="Priority"
            required
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget"
          variant="outlined"
          fullWidth
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          style={{ marginBottom: '20px' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Assign Project
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        style={{ bottom: '20px' }}
      />
    </Box>
    </main>
     </div>
  );
};

export default AssignProjectForm;
