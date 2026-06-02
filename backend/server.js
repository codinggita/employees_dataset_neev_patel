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
const metaRoutes = require('./routes/metaRoutes');

// Import middlewares
const logger = require('./middlewares/logger');
const requestTime = require('./middlewares/requestTime');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. cors()
app.use(cors({ preflightContinue: true }));
// 2. express.json()
app.use(express.json());
// 3. express.urlencoded()
app.use(express.urlencoded({ extended: true }));
// 4. logger
app.use(logger);
// 4. requestTime
app.use(requestTime);

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// 5. Mount routes
app.use('/', metaRoutes);
app.use('/', employeeRoutes);
app.use('/', searchRoutes);
app.use('/employees/filter', filterRoutes);
app.use('/', analyticsRoutes);
app.use('/stats', statsRoutes);
app.use('/auth', authRoutes);
app.use('/jwt', jwtRoutes);
app.use('/admin', adminRoutes);
app.use('/protected', protectedRoutes);
app.use('/middleware', middlewareRoutes);

// 6. 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// 7. Error handler (must be absolutely last)
app.use(errorHandler);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
