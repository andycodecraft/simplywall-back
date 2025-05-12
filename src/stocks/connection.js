// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: '207.246.103.26',
//     user: 'root',
//     password: '123456789',
//     database: 'stocks_db',
//     port: 3306
// });

// const connectDB = () => {
//     connection.connect((err) => {
//         if (err) {
//             console.error('Error connecting to the database:', err.stack);
//             return;
//         }
//         console.log('Connected to the database as ID', connection.threadId);
//     });
// };

// module.exports = connectDB;

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'ec2-54-221-158-206.compute-1.amazonaws.com', // Your database host
    user: 'root',            // Your database user
    password: '123456789a!',   // Your database password
    database: 'stocks_db',   // Your database name
    port: 3306,              // Your database port
    waitForConnections: true,
    connectionLimit: 10,     // Maximum number of connections in the pool
    queueLimit: 0            // Maximum number of connection requests
});

module.exports = pool;
