// client/src/components/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import requestService from '../services/requestService';
import RequestForm from './RequestForm';

function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requestStats, setRequestStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRequestForm, setOpenRequestForm] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
          const userRequests = await requestService.getUserRequests();

        // Calculate stats
        const stats = {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: userRequests.length,
        };

        userRequests.forEach((request) => {
          stats[request.status.toLowerCase()]++;
        });

        setRequestStats(stats);
        setRecentRequests(userRequests.slice(0, 3)); // Get 3 most recent requests
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateRequest = async (newRequest) => {
    try {
      await requestService.createRequest(newRequest);
      setOpenRequestForm(false);
      navigate('/employee'); // Redirect to employee view to see all requests
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container className="page-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome back, {currentUser?.name || 'User'}
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Time-Off Overview</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle2">Total Requests</Typography>
                  <Typography variant="h4">{requestStats.total}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle2">Pending</Typography>
                  <Typography variant="h4">{requestStats.pending}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle2">Approved</Typography>
                  <Typography variant="h4">{requestStats.approved}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent>
                  <Typography variant="subtitle2">Rejected</Typography>
                  <Typography variant="h4">{requestStats.rejected}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Requests</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenRequestForm(true)}
                >
                  New Request
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {recentRequests.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  You haven't submitted any time-off requests yet.
                </Typography>
              ) : (
                recentRequests.map((request) => (
                  <Card key={request.id} sx={{ mb: 2 }} className="request-card">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: request.status === 'PENDING' ? 'info.main' :
                                   request.status === 'APPROVED' ? 'success.main' : 'error.main'
                          }}
                        >
                          {request.status}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {request.reason}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              )}

              {recentRequests.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button onClick={() => navigate('/employee')}>
                    View All Requests
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => setOpenRequestForm(true)}
              >
                Create New Request
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
              {currentUser?.role === 'manager' && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/manager')}
                >
                  Manage Requests
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <RequestForm
        open={openRequestForm}
        onClose={() => setOpenRequestForm(false)}
        onSubmit={handleCreateRequest}
      />
    </Container>
  );
}

export default Dashboard;