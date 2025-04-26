import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Box,
  Divider,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const statusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

const reasonIcons = {
  VACATION: '🏖️',
  SICK: '🤒',
  PERSONAL: '👤',
  FAMILY: '👪',
  OTHER: '📝',
};

const RequestList = ({ requests, onViewDetails, isManager = false }) => {
  if (requests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="body1" color="textSecondary">
          No requests found.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {requests.map((request) => (
        <Grid item xs={12} key={request.id}>
          <Card
            sx={{
              overflow: 'visible',
              borderLeft: `4px solid ${
                statusColors[request.status] === 'warning' ? '#ff9800' :
                statusColors[request.status] === 'success' ? '#4caf50' :
                '#f44336'
              }`,
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {reasonIcons[request.reason_type] || '📝'} {request.reason_type.charAt(0) + request.reason_type.slice(1).toLowerCase()} Leave
                    </Typography>
                    <Chip
                      label={request.status}
                      color={statusColors[request.status]}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {request.reason}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">
                          {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24) + 1)} days
                        </Typography>
                      </Box>
                    </Grid>

                    {isManager && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">
                            {request.employee_name}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'flex-start', sm: 'flex-end' },
                      height: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Request ID: {request.request_id || 'Pending'}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => onViewDetails(request.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestList;