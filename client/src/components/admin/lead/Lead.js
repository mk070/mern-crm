import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "./theme";
import {  TextField, Button, Grid, Typography,Box } from '@mui/material';
import Side from '../side/side';

import './lead.css';
function Lead() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [isSidebar, setIsSidebar] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [form, setForm] = useState({ sno: '', name: '', email: '', phone: '', address: '', source: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/lead/lead');
    setUsers(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      await axios.put(`http://localhost:5000/api/lead/lead/${currentUser._id}`, form);
    } else {
      await axios.post('http://localhost:5000/api/lead/lead', form);
    }
    setForm({ sno: '', name: '', email: '', phone: '', address: '', source: '' });
    setCurrentUser(null);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setForm(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lead/lead/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Failed to delete lead');
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
          <button  className="editButton" onClick={() => handleEdit(params.row)}>Edit</button>
          <button className="deleteButton" onClick={() => handleDelete(params.row._id)}>Delete</button>
        </>
      ),
      width: 200,
    },
  ];

  return (
    <>
    <div className="app">
       <Side isSidebar={isSidebar}/>
      <main className="content">
    <div style={{ height: 400, width: '100%' }}>
    

      
     <Box m="20px">
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="SNO" 
              variant="outlined" 
              name="sno" 
              value={form.sno} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="Name" 
              variant="outlined" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="Email" 
              variant="outlined" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="Phone" 
              variant="outlined" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="Address" 
              variant="outlined" 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <TextField 
              fullWidth 
              label="Source" 
              variant="outlined" 
              name="source" 
              value={form.source} 
              onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={8} sm={5} md={2}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              {currentUser ? 'Update' : 'Create'}
            </Button>
          </Grid>
        </Grid>
      </form>
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
     </Box>
    </Box>
    </div>
    </main>
     </div>
  </>
  );
}

export default Lead;
