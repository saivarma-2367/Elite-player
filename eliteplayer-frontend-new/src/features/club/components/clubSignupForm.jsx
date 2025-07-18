import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  ThemeProvider,
  CssBaseline,
  Stack,
} from '@mui/material';
import { z } from 'zod';
import axios from 'axios';
import { getTheme } from '../../../theme';
import { registerClub } from '../api/authClubApi';

const clubSchema = z
  .object({
    userName: z.string().min(1, 'User name is required'),
    spoc: z.string().min(1, 'SPOC is required'),
    email: z.string().email('Invalid email'),
    membership: z.enum(['Gold', 'Silver', 'Bronze']),
    mobileNumber: z.string().regex(/^\d{10}$/, 'Must be a 10-digit number'),
    referral: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    address: z.object({
      dno: z.string().optional(),
      locality: z.string().min(1, 'Locality is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit PIN'),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });


const ClubSignupForm = () => {
  const theme = getTheme('light');

  const [formData, setFormData] = useState({
  userName: '',
  spoc: '',
  email: '',
  membership: '',
  mobileNumber: '',
  referral: '',
  password: '',
  confirmPassword: '',
  address: {
    pincode: '',
    state: '',
    city: '',
    locality: '',
    dno: ''
  },
});

  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
  const { name, value } = e.target;

  if (name === 'address.pincode') {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        pincode: value
      }
    }));

    if (/^\d{6}$/.test(value)) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
        const data = res.data[0];

        if (data.Status === 'Success') {
          const postOffice = data.PostOffice[0];
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              pincode: value,
              state: postOffice.State,
              city: postOffice.District
            }
          }));
        } else {
          alert('Invalid PIN code');
        }
      } catch (err) {
        console.error('PIN code lookup failed:', err);
        alert('Failed to fetch address details.');
      }
    }
    return;
  }

  if (name.startsWith('address.')) {
    const field = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  try {
    const parsed = clubSchema.parse(formData);

    const res = await registerClub(parsed);

    if (res.status === 201) {
      alert('Club registered and user created successfully!');
      setFormData({
        userName: '',
        spoc: '',
        email: '',
        membership: '',
        mobileNumber: '',
        referral: '',
        password: '',
        confirmPassword: '',
        address: {
          pincode: '',
          state: '',
          city: '',
          locality: '',
          dno: ''
        }
      });
    } else {
      alert('Unexpected response. Please try again.');
    }
  } catch (err) {
    if (err.name === 'ZodError') {
      const errorObj = {};
      err.errors.forEach((e) => {
        const key = e.path.join('.');
        errorObj[key] = e.message;
      });
      setErrors(errorObj);
    } else if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      console.error('Unexpected error:', err);
      alert('Submission failed');
    }
  }
};


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Register a Club
        </Typography>

        <Stack spacing={1}>
          <TextField
            label="User Name *"
            name="userName"
            fullWidth
            size="small"
            value={formData.userName}
            onChange={handleChange}
            error={!!errors.userName}
            helperText={errors.userName}
          />

          <TextField
            label="SPOC *"
            name="spoc"
            fullWidth
            size="small"
            value={formData.spoc}
            onChange={handleChange}
            error={!!errors.spoc}
            helperText={errors.spoc}
          />

          <TextField
            label="Email *"
            name="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Membership *"
            name="membership"
            select
            SelectProps={{ native: true }}
            fullWidth
            size="small"
            value={formData.membership}
            onChange={handleChange}
            error={!!errors.membership}
            helperText={errors.membership}
          >
            <option value="">Select membership</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </TextField>

          <TextField
            label="Mobile Number *"
            name="mobileNumber"
            fullWidth
            size="small"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
          />

          <TextField
            label="Referral"
            name="referral"
            fullWidth
            size="small"
            value={formData.referral}
            onChange={handleChange}
          />
          <TextField
  label="Password *"
  name="password"
  type="password"
  fullWidth
  size="small"
  value={formData.password}
  onChange={handleChange}
  error={!!errors.password}
  helperText={errors.password}
/>

<TextField
  label="Confirm Password *"
  name="confirmPassword"
  type="password"
  fullWidth
  size="small"
  value={formData.confirmPassword}
  onChange={handleChange}
  error={!!errors.confirmPassword}
  helperText={errors.confirmPassword}
/>


          <Typography variant="subtitle2" sx={{ mt: 2 }}>
  Address
</Typography>

<TextField
  label="Pincode *"
  name="address.pincode"
  fullWidth
  size="small"
  value={formData.address.pincode}
  onChange={handleChange}
  error={!!errors['address.pincode']}
  helperText={errors['address.pincode']}
/>

<TextField
  label="State *"
  name="address.state"
  fullWidth
  size="small"
  value={formData.address.state}
  onChange={handleChange}
  disabled
/>

<TextField
  label="City *"
  name="address.city"
  fullWidth
  size="small"
  value={formData.address.city}
  onChange={handleChange}
  disabled
/>


<TextField
  label="Locality *"
  name="address.locality"
  fullWidth
  size="small"
  value={formData.address.locality}
  onChange={handleChange}
  error={!!errors['address.locality']}
  helperText={errors['address.locality']}
/>

<TextField
  label="Door No."
  name="address.dno"
  fullWidth
  size="small"
  value={formData.address.dno}
  onChange={handleChange}
/>


          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register Club
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default ClubSignupForm;
