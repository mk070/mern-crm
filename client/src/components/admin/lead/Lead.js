import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "./theme";
import { TextField, Button, Grid, Typography, Box, CircularProgress, Card, CardContent, Snackbar } from '@mui/material';
import Side from '../side/side';
import MuiAlert from '@mui/material/Alert';
import './lead.css';
import Header from '../side/header';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

function Lead() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [isSidebar, setIsSidebar] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [form, setForm] = useState({ sno: '', name: '', email: '', phone: '', address: '', source: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/lead/lead`);
      console.log('Fetched users:', response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]); // Ensure users is always an array
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentUser) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/lead/lead/${currentUser._id}`, form);
        setSnackbarMessage('Lead updated successfully');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/lead/lead`, form);
        setSnackbarMessage('Lead created successfully');
      }
      setForm({ sno: '', name: '', email: '', phone: '', address: '', source: '' });
      setCurrentUser(null);
      fetchUsers();
      setOpenSnackbar(true);
    } catch (err) {
      setError('Failed to save user');
      console.error('Error saving user:', err);
      setSnackbarMessage('Failed to save lead');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setForm(user);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/lead/lead/${id}`);
      fetchUsers();
      setSnackbarMessage('Lead deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      setError('Failed to delete lead');
      console.error('Failed to delete lead:', err);
      setSnackbarMessage('Failed to delete lead');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'source', headerName: 'Source', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEdit(params.row)} size="small" sx={{ mr: 1 }}>Edit</Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row._id)} size="small">Delete</Button>
        </>
      ),
      width: 200,
    },
  ];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="app">
      <Side isSidebar={isSidebar} />
      <main className="content">
        <Box m="20px">
          <Card>
            <CardContent>
              <Header title="Create or Edit Lead" subtitle="" />
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {['sno', 'name', 'email', 'phone', 'address', 'source'].map((field, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <TextField
                        fullWidth
                        label={field.toUpperCase()}
                        variant="outlined"
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                      {loading ? <CircularProgress size={24} /> : (currentUser ? 'Update' : 'Create')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {error && <Typography color="error">{error}</Typography>}
            </CardContent>
          </Card>
          <Box m="40px 0 0 0" height="75vh" sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}>
            {loading ? <CircularProgress /> : (
              <DataGrid
                rows={users.map(user => ({ ...user, id: user._id }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
                components={{
                  Toolbar: GridToolbar,
                }}
              />
            )}
          </Box>
        </Box>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
}

export default Lead;
