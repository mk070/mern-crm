import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import Side from '../side/side';
import EmailIcon from '@mui/icons-material/Email'; // Importing MUI email icon
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Importing MUI access time icon

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    async function fetchQueries() {
      try {
        const res = await axios.get('http://localhost:5000/api/query');
        setQueries(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchQueries();
  }, []);

  return (
    <div className="app">
      <Side isSidebar={isSidebar} />
      <main className="content">
        <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '16px',fontWeight:'bold' }}>
          Queries Received
        </Typography>
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', marginLeft: '16px' }}>
          {queries.map((q, index) => (
            <Card key={index} style={{ width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' } }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {q.type === 'email' ? <EmailIcon fontSize="large" /> : <AccessTimeIcon fontSize="large" />}
                <Typography variant="h6" style={{ marginTop: '8px' }}>
                  {q.query}
                </Typography>
                <List>
                  {q.queries && q.queries.map((query, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={query} />
                    </ListItem>
                  ))}
                </List>
              
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QueryList;
