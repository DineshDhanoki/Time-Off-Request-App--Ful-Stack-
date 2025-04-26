import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import requestService from '../services/requestService';
import RequestList from './RequestList';
import RequestForm from './RequestForm';
import { useNavigate } from 'react-router-dom';

function EmployeeView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openRequestForm, setOpenRequestForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getUserRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (newRequest) => {
    try {
      await requestService.createRequest(newRequest);
      setOpenRequestForm(false);
      fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">My Time-Off Requests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenRequestForm(true)}
        >
          New Request
        </Button>
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
      ) : (
        <RequestList
          requests={getFilteredRequests()}
          onViewDetails={handleViewDetails}
        />
      )}

      <RequestForm
        open={openRequestForm}
        onClose={() => setOpenRequestForm(false)}
        onSubmit={handleCreateRequest}
      />
    </Container>
  );
}

export default EmployeeView;
