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
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Owner = require('./models/Owner');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const staffRoutes = require('./routes/staff');
const customerRoutes = require('./routes/customer');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const exists = await Owner.findOne();
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Owner.create({ name: 'Owner', email: 'admin@cafe.com', password: hashed, cafeName: 'My Cafe' });
      console.log('Default owner created: admin@cafe.com / admin123');
    }
  })
  .catch(err => console.log('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
