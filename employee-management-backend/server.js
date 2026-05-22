const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

// Import route files
const employeeRoutes = require('./routes/employeeRoutes');
const searchRoutes = require('./routes/searchRoutes');
const filterRoutes = require('./routes/filterRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const adminRoutes = require('./routes/adminRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');

// Import middlewares
const logger = require('./middlewares/logger');
const requestTime = require('./middlewares/requestTime');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(requestTime);

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Mount routes
app.use('/employees', employeeRoutes);
app.use('/search', searchRoutes);
app.use('/employees/filter', filterRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);
app.use('/jwt', jwtRoutes);
app.use('/admin', adminRoutes);
app.use('/protected', protectedRoutes);
app.use('/middleware', middlewareRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
