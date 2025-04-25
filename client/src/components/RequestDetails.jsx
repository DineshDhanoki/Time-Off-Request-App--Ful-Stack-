import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import requestService from '../services/requestService';
import useAuth from '../hooks/useAuth';

const statusColors = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await requestService.getRequestById(id);
      setRequest(data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await requestService.approveRequest(id, { comment });
      setOpenApproveDialog(false);
      fetchRequestDetails();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async () => {
    try {
      await requestService.rejectRequest(id, { comment });
      setOpenRejectDialog(false);
      fetchRequestDetails();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';
  const isPending = request?.status === 'PENDING';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!request) {
    return (
      <Container className="page-container">
        <Typography variant="h5" sx={{ mb: 2 }}>Request not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4">Time-Off Request Details</Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {request.reason_type.charAt(0) + request.reason_type.slice(1).toLowerCase()} Leave
            </Typography>
            <Chip 
              label={request.status} 
              color={statusColors[request.status]} 
              size="medium"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Employee
              </Typography>
              <Typography variant="body1" gutterBottom>
                {request.employee_name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Role
              </Typography>
              <Typography variant="body1" gutterBottom>
                {request.employee_role}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Start Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(request.start_date).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                End Date
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(request.end_date).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Total Days
              </Typography>
              <Typography variant="body1" gutterBottom>
                {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24) + 1)} days
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Request ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {request.request_id || 'Pending assignment'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Reason
              </Typography>
              <Typography variant="body1" paragraph>
                {request.reason}
              </Typography>
            </Grid>

            {request.manager_comment && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Manager Comment
                </Typography>
                <Typography variant="body1" paragraph>
                  {request.manager_comment}
                </Typography>
              </Grid>
            )}
          </Grid>

          {isManager && isPending && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<CancelIcon />}
                onClick={() => setOpenRejectDialog(true)}
              >
                Reject
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<CheckCircleIcon />}
                onClick={() => setOpenApproveDialog(true)}
              >
                Approve
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Time-Off Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this time-off request? Please add any optional comments below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comments (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApprove} variant="contained" color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Time-Off Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this time-off request? Please provide a reason for rejection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button onClick={handleReject} variant="contained" color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RequestDetails;
