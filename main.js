require('dotenv').config();
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  port: 3306,
  host: '127.0.0.1',
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASS
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.code); // Muestra el código de error específico
    console.error('Mensaje de error:', err.message); // Muestra el mensaje de error
    throw err;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

connection.query(
  'SELECT * FROM wp_comments',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);