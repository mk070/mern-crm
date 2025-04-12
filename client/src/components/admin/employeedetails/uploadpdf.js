import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Button, 
    TextField, 
    CircularProgress, 
    Alert, 
    Typography, 
    Box,
    FormControlLabel,
    ListItemText,
    Checkbox,
    FormGroup 
} from '@mui/material';
import Header from '../side/header';

function UploadPDF() {
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState('');
    const [clientIds, setClientIds] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSidebar, setIsSidebar] = useState(true);



    useEffect(() => {
        fetchEmployeeDetails();
        fetchClientDetails();
    }, []);

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onEmployeeSelect = event => {
        const selectedId = event.target.value;
        setUserId(selectedId);
        const employee = employees.find(emp => emp._id === selectedId);
        setSelectedEmployee(employee);
    };

    const onClientSelect = (event) => {
        const value = event.target.value; // This should already be an array of selected values
        setClientIds(value); // Update the state directly with this array
    };
    
    
    
    

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!file || !userId) {
            alert("Both file and user ID are required.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append('pdfFile', file);
        formData.append('userId', userId);
    
        try {
            const uploadResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/assign/upload`, formData);
            await axios.post(`${process.env.REACT_APP_API_URL}/api/assign/assignClients`, {
                employeeId: userId,
                clientIds: clientIds
            });
            alert('File and clients assigned successfully for ' + uploadResponse.data.name);

            
        } catch (error) {
            console.error('Error uploading file or assigning clients:', error);
            setError('Failed to upload file or assign clients.');
        } finally {
            setLoading(false);
        }
    };
    

    const fetchEmployeeDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/assign/empdetails`);
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employee details:', error);
            setError('Failed to fetch employee details.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchClientDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/assign/clients`);
            setClients(response.data);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
            setError('Failed to fetch clients.');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div className="app">
      
      <main className="content">
      <Box sx={{ marginLeft: '20px' }}>
        <Header title="Assign Lead & Clients" subtitle="" />
        </Box> 
        <Box sx={{ maxWidth: 480, margin: 'auto', padding: 2 }}>
       
            <form onSubmit={onSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="employee-label">Select an Employee</InputLabel>
                    <Select
                        labelId="employee-label"
                        value={userId}
                        label="Select an Employee"
                        onChange={onEmployeeSelect}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {employees.map(emp => (
                            <MenuItem key={emp._id} value={emp._id}>{emp.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Button
                        variant="contained"
                        component="label"
                        sx={{
                            width: 200, // sets the width to 200 pixels
                        maxWidth: '80%', // ensures the button does not exceed 80% of its container width
                            backgroundColor: '#1565c0', // Custom color
                            '&:hover': {
                                backgroundColor: '#0d47a1', // Darker blue on hover
                                transform: 'scale(1.05)', // Scale up effect on hover
                            },
                            padding: '10px 20px ',
                            
                            borderRadius: '8px',
                            transition: 'transform 0.2s, background-color 0.2s', // Transition for smooth effects
                        }}
                    >
                        Select Lead details
                        <input
                            type="file"
                            hidden
                            onChange={onFileChange}
                        />
                    </Button>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel id="client-label">Select Clients</InputLabel>
                <Select
                    labelId="client-label"
                    multiple
                    value={clientIds}
                    onChange={onClientSelect}
                    renderValue={(selected) => 
                        selected.map(id => clients.find(client => client._id === id)?.name).join(', ')
                    }
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 224,
                                width: 250,
                            },
                        },
                    }}
                >
                    {clients.map(client => (
                        <MenuItem key={client._id} value={client._id}>
                            <Checkbox checked={clientIds.indexOf(client._id) > -1} />
                            <ListItemText primary={client.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


                {selectedEmployee && (
                    <Typography variant="subtitle1" gutterBottom>
                        {selectedEmployee.name} - {selectedEmployee.email}
                    </Typography>
                )}
                <Button type="submit" 
                variant="contained"
                 color="primary"
                 sx={{
                        width: 200, // sets the width to 200 pixels
                    maxWidth: '80%', // ensures the button does not exceed 80% of its container width
                        backgroundColor: '#1565c0', // Custom color
                        '&:hover': {
                            backgroundColor: '#0d47a1', // Darker blue on hover
                            transform: 'scale(1.05)', // Scale up effect on hover
                        },
                        padding: '10px 20px ',
                        marginTop : '20px',
                        borderRadius: '8px',
                        transition: 'transform 0.2s, background-color 0.2s', // Transition for smooth effects
                    }}
                 disabled={loading}>
                    Upload & Assign
                </Button>
            </form>
        </Box>
        </main>
        </div>
    );
}

export default UploadPDF;
