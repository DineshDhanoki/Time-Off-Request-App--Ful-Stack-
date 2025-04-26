import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RequestForm = ({ open, onClose, onSubmit, initialValues = null }) => {
  const [formData, setFormData] = useState({
    start_date: initialValues?.start_date || null,
    end_date: initialValues?.end_date || null,
    reason: initialValues?.reason || '',
    reason_type: initialValues?.reason_type || 'VACATION',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.start_date > formData.end_date) {
      newErrors.start_date = 'Start date cannot be after end date';
      newErrors.end_date = 'End date cannot be before start date';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Custom input component to integrate with Material UI
  const CustomInput = React.forwardRef(({ value, onClick, label, error, helperText }, ref) => (
    <TextField
      fullWidth
      label={label}
      onClick={onClick}
      ref={ref}
      value={value}
      error={!!error}
      helperText={helperText}
      InputProps={{
        readOnly: true,
      }}
    />
  ));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? 'Edit Time-Off Request' : 'New Time-Off Request'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <DatePicker
            selected={formData.start_date}
            onChange={(date) => {
              setFormData({
                ...formData,
                start_date: date,
              });
            }}
            dateFormat="MM/dd/yyyy"
            customInput={
              <CustomInput 
                label="Start Date" 
                error={errors.start_date} 
                helperText={errors.start_date} 
              />
            }
          />

          <DatePicker
            selected={formData.end_date}
            onChange={(date) => {
              setFormData({
                ...formData,
                end_date: date,
              });
            }}
            dateFormat="MM/dd/yyyy"
            customInput={
              <CustomInput 
                label="End Date" 
                error={errors.end_date} 
                helperText={errors.end_date} 
              />
            }
          />

          <FormControl fullWidth>
            <InputLabel id="reason-type-label">Reason Type</InputLabel>
            <Select
              labelId="reason-type-label"
              id="reason-type"
              name="reason_type"
              value={formData.reason_type}
              label="Reason Type"
              onChange={handleChange}
            >
              <MenuItem value="VACATION">Vacation</MenuItem>
              <MenuItem value="SICK">Sick Leave</MenuItem>
              <MenuItem value="PERSONAL">Personal</MenuItem>
              <MenuItem value="FAMILY">Family Emergency</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Reason Description"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.reason}
            helperText={errors.reason}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialValues ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestForm;