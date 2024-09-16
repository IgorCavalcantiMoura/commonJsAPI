const mysql = require('mysql2')


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "root",
    database: "clientsbd",
})

module.exports = connection