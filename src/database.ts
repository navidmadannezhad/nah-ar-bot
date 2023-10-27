// require('dotenv').config()
// const mysql = require('mysql');

// const DB_CONFIG = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }

// const connection = mysql.createConnection(DB_CONFIG);

// connection.connect((err: any) => {
//     if (err) throw err;
//     var sql = "CREATE TABLE config (name VARCHAR(255), address VARCHAR(255))";
//     connection.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });
// });