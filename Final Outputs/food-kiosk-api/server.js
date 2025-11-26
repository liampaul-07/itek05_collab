const express = require('express');

const foodRoutes = require('./src/routes/foodRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const customerRoutes = require('./src/routes/customersRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const orderDetailRoutes = require('./src/routes/orderDetailRoute');
const db = require('./src/config/database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/fooditems', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderDetailRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database configuration loaded.`);
});