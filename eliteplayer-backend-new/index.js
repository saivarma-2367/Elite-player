const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./db');
const userRoutes = require('./userRoutes');
const cors = require('cors');
const clubRoutes = require('./club/clubRoutes');
const partnerRoutes = require('./user/partnerRoutes');
const slotRoutes=require('./user/slotRoutes')

const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

console.log('Registering /api/users routes');
app.use('/api/users', userRoutes);

console.log('Registering /api/clubs routes');
app.use('/api/clubs', clubRoutes);

console.log('Registering /api/partners routes');
app.use('/api/partners', partnerRoutes);

app.use('/api/slots',slotRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
