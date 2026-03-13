const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe-os';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Routes
const tenantRoutes = require('./routes/tenantRoutes');
const planRoutes = require('./routes/planRoutes');
const featureRoutes = require('./routes/featureRoutes');
const userRoutes = require('./routes/userRoutes');
const logRoutes = require('./routes/logRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const alertRoutes = require('./routes/alertRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const tenantEntityRoutes = require('./routes/tenantEntityRoutes');

app.use('/api/admin/tenants', tenantRoutes);
// Keep legacy singular route for backward compatibility
app.use('/api/admin/tenant', tenantRoutes);
app.use('/api/admin/plans', planRoutes);
app.use('/api/admin/features', featureRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/logs', logRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/alerts', alertRoutes);
app.use('/api/admin/invoices', invoiceRoutes);
app.use('/api/tenant', tenantEntityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting
  res.json({
    status: dbState === 1 ? 'ok' : 'degraded',
    db: ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

// Start server immediately — don't block on DB
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB connection (non-fatal)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('→ API requests that require the database will return 503 until MongoDB is available.');
  });
