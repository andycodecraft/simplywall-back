const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'ec2-54-221-158-206.compute-1.amazonaws.com',
    user: 'root',
    password: '123456789a!',
    database: 'stocks_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
