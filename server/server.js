const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
