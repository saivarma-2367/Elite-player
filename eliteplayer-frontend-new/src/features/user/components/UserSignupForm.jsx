import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Stack,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { z } from 'zod';
import { getTheme } from '../../../theme';
import { registerUser } from '../api/authApi';

const sportSchema = z.object({
  sportName: z.string().min(1, 'Sport name is required'),
});

const userSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  primaryPhoneNumber: z.number(),
  secondaryPhoneNumber: z.number().optional(),
  address: z.string().min(1),
  primaryEmail: z.string().email(),
  secondaryEmail: z.string().email().optional(),
  referalId: z.string().optional(),
  sport: z.array(sportSchema).min(1),
  clubId: z.number(),
  gender: z.enum(['male', 'female', 'prefer not to say']),
  userType: z.enum(['member', 'visitor', 'coach', 'admin']),
  password: z.string().min(6, 'Password must be at least 6 characters')
});


const SignupForm = () => {
  const [formData, setFormData] = useState({
  userName: '',
  primaryPhoneNumber: '',
  secondaryPhoneNumber: '',
  address: '',
  primaryEmail: '',
  secondaryEmail: '',
  referalId: '',
  sport: [{ sportName: '' }],
  clubId: '',
  gender: '',
  userType: 'member',
  password: ''
});


  const [errors, setErrors] = useState({});
  const theme = getTheme('light');

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name.startsWith('sportName') && index !== null) {
      const updatedSport = [...formData.sport];
      updatedSport[index].sportName = value;
      setFormData({ ...formData, sport: updatedSport });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addSportField = () => {
    setFormData({ ...formData, sport: [...formData.sport, { sportName: '' }] });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({});

    try {
  const parsed = {
    ...formData,
    primaryPhoneNumber: Number(formData.primaryPhoneNumber),
    secondaryPhoneNumber: formData.secondaryPhoneNumber
      ? Number(formData.secondaryPhoneNumber)
      : undefined,
    clubId: Number(formData.clubId),
  };

  userSchema.parse(parsed);

  const response = await registerUser(formData);
  alert('User created successfully!');
  console.log(response.data);
} catch (err) {
  if (err.response?.data?.message) {
    alert(`Server Error: ${err.response.data.message}`);
  } else if (err.errors) {
    const errorObj = {};
    err.errors.forEach(e => {
      const key = e.path.join('.');
      errorObj[key] = e.message;
    });
    setErrors(errorObj);
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
          User Signup
        </Typography>

        <Stack spacing={1}>

          <TextField
            label="Username *"
            name="userName"
            fullWidth
            size="small"
            margin="dense"
            value={formData.userName}
            onChange={handleChange}
            error={!!errors.userName}
            helperText={errors.userName}
          />

          <TextField
  label="Password *"
  name="password"
  type="password"
  fullWidth
  size="small"
  margin="dense"
  value={formData.password}
  onChange={handleChange}
  error={!!errors.password}
  helperText={errors.password}
/>


          <TextField
            label="Primary Phone Number *"
            name="primaryPhoneNumber"
            fullWidth
            size="small"
            margin="dense"
            value={formData.primaryPhoneNumber}
            onChange={handleChange}
            error={!!errors.primaryPhoneNumber}
            helperText={errors.primaryPhoneNumber}
          />

          <TextField
            label="Secondary Phone Number"
            name="secondaryPhoneNumber"
            fullWidth
            size="small"
            margin="dense"
            value={formData.secondaryPhoneNumber}
            onChange={handleChange}
            error={!!errors.secondaryPhoneNumber}
            helperText={errors.secondaryPhoneNumber}
          />

          <TextField
            label="Primary Email *"
            name="primaryEmail"
            fullWidth
            size="small"
            margin="dense"
            value={formData.primaryEmail}
            onChange={handleChange}
            error={!!errors.primaryEmail}
            helperText={errors.primaryEmail}
          />

          <TextField
            label="Secondary Email"
            name="secondaryEmail"
            fullWidth
            size="small"
            margin="dense"
            value={formData.secondaryEmail}
            onChange={handleChange}
            error={!!errors.secondaryEmail}
            helperText={errors.secondaryEmail}
          />

          <TextField
            label="Address *"
            name="address"
            fullWidth
            size="small"
            margin="dense"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />

          <TextField
  label="Gender *"
  name="gender"
  select
  SelectProps={{ native: true }}
  fullWidth
  size="small"
  margin="dense"
  value={formData.gender}
  onChange={handleChange}
  error={!!errors.gender}
  helperText={errors.gender}
>
  <option value="">Select gender</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
  <option value="prefer not to say">Prefer not to say</option>
</TextField>

          <TextField
            label="Referral ID"
            name="referalId"
            fullWidth
            size="small"
            margin="dense"
            value={formData.referalId}
            onChange={handleChange}
            error={!!errors.referalId}
            helperText={errors.referalId}
          />

          <Typography variant="subtitle2">Sports</Typography>
          {formData.sport.map((sport, index) => (
            <TextField
              key={index}
              label={`Sport ${index + 1} *`}
              name={`sportName-${index}`}
              fullWidth
              size="small"
              margin="dense"
              value={sport.sportName}
              onChange={(e) => handleChange(e, index)}
              error={!!errors[`sport.${index}.sportName`]}
              helperText={errors[`sport.${index}.sportName`]}
            />
          ))}
          <IconButton onClick={addSportField} color="primary" size="small">
            <AddIcon fontSize="small" />
          </IconButton>

          <TextField
            label="Club ID *"
            name="clubId"
            fullWidth
            size="small"
            margin="dense"
            value={formData.clubId}
            onChange={handleChange}
            error={!!errors.clubId}
            helperText={errors.clubId}
          />

          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default SignupForm;
