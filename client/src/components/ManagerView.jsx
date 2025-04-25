import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import requestService from '../services/requestService';
import RequestList from './RequestList';
import useWebSocket from '../hooks/useWebSocket';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function ManagerView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Setup WebSocket for real-time updates
  useWebSocket(currentUser?.id, (data) => {
    if (data.type === 'NEW_REQUEST') {
      fetchRequests();
    }
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFilteredRequests = () => {
    if (tabValue === 0) return requests;
    const statusMap = {
      1: 'PENDING',
      2: 'APPROVED',
      3: 'REJECTED',
    };
    return requests.filter((request) => request.status === statusMap[tabValue]);
  };

  const handleViewDetails = (requestId) => {
    navigate(`/requests/${requestId}`);
  };

  return (
    <Container className="page-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Team Time-Off Requests</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Review and manage time-off requests from your team
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="request tabs">
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : getFilteredRequests().length > 0 ? (
        <RequestList 
          requests={getFilteredRequests()}
          onViewDetails={handleViewDetails}
          isManager
        />
      ) : (
        <Alert severity="info">No requests found for the selected filter.</Alert>
      )}
    </Container>
  );
}

export default ManagerView;
