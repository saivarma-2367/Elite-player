import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { z } from 'zod';
import { getTheme } from '../../../theme';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { loginUser } from '../api/authApi';


const loginSchema = z.object({
  login: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = (props) => {
  console.log("LoginForm props:", props);
  console.log("Type of setUser:", typeof props.setUser);
  if (typeof props.setUser !== 'function') {
    console.error("setUser prop is NOT a function! Cannot proceed.");
  }
  const { setUser } = props;

  console.log("Rendering LoginForm.jsx");
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = getTheme('light');
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  console.log("Submitting login form with:", formData);

  try {
    setLoading(true);
    loginSchema.parse(formData);
    console.log("Validation passed");

    const response = await loginUser(formData);
    console.log("API response:", response);

    const user = response.data.user;
    console.log("Logged in user:", user);

    setUser(user);
    console.log("User set in state, navigating to /userSuccess");

    navigate('/userSuccess');
  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.status === 401 || err.response?.status === 404) {
      alert('Invalid credentials. Please try again.');
    } else if (err.response?.data?.message) {
      alert(`Server Error: ${err.response.data.message}`);
    } else if (err.errors) {
      const errorObj = {};
      err.errors.forEach(e => {
        const key = e.path.join('.');
        errorObj[key] = e.message;
      });
      setErrors(errorObj);
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
          mt: 8,
          p: 3,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Username or Email"
            name="login"
            fullWidth
            size="small"
            value={formData.login}
            onChange={handleChange}
            error={!!errors.login}
            helperText={errors.login}
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

          <Button variant="contained" type="submit" fullWidth disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}>
            {loading ? 'Logging in ...' : 'Login'}
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
