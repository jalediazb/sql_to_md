require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require("path");

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

const queryGetContent = `
  SELECT
    ID,
    post_date,
    post_modified,
    post_title,
    post_name,
    post_excerpt,
    post_parent,
    post_content
  FROM wp_posts
  WHERE
    post_status = 'publish'
    AND post_type IN ('post', 'page')
  `
connection.query(
  queryGetContent,
  function(err, results, fields) {
    if (err) console.log(err)
    //console.log(results); // results contains rows returned by server

    // Eliminar ficheros anteriores
    fs.readdirSync('md_files', (err, files) => {
      if (err) console.log(err)

      files.forEach(file => {
        fs.unlink(path.join('md_files', file), (err) => {
          if (err) throw err;
        });
      })
    })

    // Crear ficheros y añadir contenido
    for (item of results) {
      console.log(item.post_title)

      const data = `${item.post_title}`

      fs.writeFileSync(`md_files/${item.post_name}.md`, data)
    }
  }
);