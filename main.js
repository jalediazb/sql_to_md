const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  port: 3306,
  host: 'localhost',
  user: 'root',
  database: 'bitnami_wordpress',
  password: '54a30098e2'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err.code); // Muestra el código de error específico
    console.error('Mensaje de error:', err.message); // Muestra el mensaje de error
    throw err;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});