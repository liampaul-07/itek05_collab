const express = require('express');

const foodRoutes = require('./src/routes/foodRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
require('./src/config/database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/fooditems', foodRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database configuration loaded.`);
    console.log(`Test your GET endpoint at: http://localhost:${PORT}/api/fooditems`);
});