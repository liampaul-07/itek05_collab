const express = require('express');

const foodRoutes = require('./src/routes/foodRoutes');
require('./src/config/database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/fooditems', foodRoutes);

// // const foodRoutes = require('./src/routes/foodRoutes');
// const path = require('path');
// require('dotenv').config();
// // const foodRoutes = require(path.join(__dirname, 'src', 'routes', 'foodRoutes'));

// //Initialization of express app.
// const app = express();
// const PORT = process.env.PORT || 3000;

// //Parse incoming JSON requests & send in requests
// app.use(express.json());

// //Temporary
// app.get('/', (req, res) => {
//     res.send('Base server is running!');
// });

// // //Route setup, any requests will be forwarded here
// // app.use('api/fooditems', foodRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database configuration loaded.`);
    console.log(`Test your GET endpoint at: http://localhost:${PORT}/api/fooditems`);
});