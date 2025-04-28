const express = require('express');
const cors = require('cors');     
const db = require('./db');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const { authenticate, authorizeRole } = require('./auth/auth');

// Import role-based routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const managerRoutes = require('./routes/manager');
const authRoutes = require('./routes/auth');


app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next(); // Pass to the next handler
});

// Allow requests from your frontend
app.use(cors({
  origin: 'http://localhost',      // adjust to your frontend’s exact origin
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','X-Original-URI','X-Role'],
  credentials: true, // Allow cookies to be sent
}));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())



// Basic route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Healthcheck (directly here)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});


// Public routes
app.use('/api/auth', authRoutes);
console.log('Backend is running!');



// // Protected routes
app.use('/api/user', authenticate, authorizeRole('Employé'), userRoutes);
app.use('/api/admin', authenticate, authorizeRole('Admin'), adminRoutes);
app.use('/api/technicien', authenticate, authorizeRole('Technicien'), managerRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
