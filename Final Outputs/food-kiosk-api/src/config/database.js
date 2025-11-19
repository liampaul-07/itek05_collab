// Import mysql2 driver. Allows to use modern JS features
const mysql = require('mysql2/promise');

//Creating a pool connection
const pool = mysql.createPool({
    //Pool credentials
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_food_kiosk',
    port: 3306,
    //Pool behaviors
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

//Connection test
pool.getConnection()
    //Connection successful
    .then(connection => {
        console.log('Database connected successfully (MySQL/XAMPP)!');
        connection.release();
    })
    //Connection error
    .catch(err => {
        console.error('Database connection error:', err.message);
    });

module.exports = {
    query: (sql, params) => pool.execute(sql, params),
};

