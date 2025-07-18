import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  ThemeProvider,
  CssBaseline,
  Stack,
  CircularProgress,
} from '@mui/material';
import { z } from 'zod';
import { getTheme } from '../../../theme';
import { loginClub } from '../api/authClubApi';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function ClubLoginForm({setAdmin}) {
  const theme = getTheme('light');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const parsed = loginSchema.parse(formData);

      const res = await loginClub(parsed);

      alert('Login successful!');
      setAdmin(res.data.club);
      console.log('MongoDB Club Object:', res.data.club)
    } catch (err) {
      if (err.errors) {
        const errorObj = {};
        err.errors.forEach((e) => {
          const key = e.path.join('.');
          errorObj[key] = e.message;
        });
        setErrors(errorObj);
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        console.error('Login failed:', err);
        alert('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 6,
          p: 3,
          boxShadow: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Club Login
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            size="small"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default ClubLoginForm;
