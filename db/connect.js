const mysql = require("mysql2");

const connect = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    }
);


module.exports = connect;