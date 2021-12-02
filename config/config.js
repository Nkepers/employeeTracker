require('dotenv').config()

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'business',
    password: process.env.PASSWORD
});

connection.connect((err) => {
    if (err) throw err;
})

module.exports = connection