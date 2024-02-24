require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require("path");
const sqlQuery = require("./sql_query")
const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require("node-html-markdown")
const replaceImageRoutesMarkdown = require("./replaceImageRoutesMarkdown")

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

function obtenerJerarquiaSlug(postsArray, postId) {
  let slug = '';
  let parentId = postId;

  while (parentId !== 0) {
      const parentPost = postsArray.find(post => post.ID === parentId);
      if (parentPost) {
          slug = parentPost.slug + '/' + slug;
          parentId = parentPost.post_parent;
      } else {
          parentId = 0;
      }
  }

  return slug;
}


connection.query(
  sqlQuery.query,
  function (err, results, fields) {
    if (err) console.log(err)
    //console.log(results); // results contains rows returned by server

    // Directorio donde se alojan los ficheros md
    const mdFiles = 'md_files'

    // Eliminar ficheros anteriores
    const files = fs.readdirSync(mdFiles);
    files.forEach(file => {
      const filePlace = path.join(mdFiles, file);
      fs.unlinkSync(filePlace);
    });

    results.forEach(post => {
      post.fullSlug = obtenerJerarquiaSlug(results, post.post_parent) + post.slug;
    });


    // Crear ficheros y añadir contenido
    for (item of results) {

      console.log(item.fullSlug)


      // Expresión regular para obtener el nombre de la imagen
      const regex = /\/([^\/]+)$/

      // Convertir HTML en Markdown
      const contenido_post = NodeHtmlMarkdown.translate(item.post_content)

      const contenidoCorregido = replaceImageRoutesMarkdown(contenido_post)

      // Fechas
      const año = item.post_date.getFullYear()
      const mes = item.post_date.getMonth() + 1
      const día = item.post_date.getDate()

      // Contenido de Fichero Markdown
      const data = `---
layout: ${item.template === 'ficha.php' ? 'ficha' : item.template === 'page-minimal.php' ? 'minimal' : 'post'}
title: '${item.post_title}'
subtitle: '${item.template === 'ficha.php' ? '' : item.post_excerpt}'
meta_title: '${item.seo_title != undefined ? item.seo_title : ''}'
meta_description: '${item.seo_description != undefined ? item.seo_description : item.post_excerpt}'
tags: [${item.categories != undefined ? item.categories.split(",").map(category => `'${category}'`).join(",") : ''}]
featuredImage: ${item.thumbnail_url != null ? item.thumbnail_url.match(regex)[1] : ''}
featuredImageAlt: '${item.alt_featured_img != null ? item.alt_featured_img : ''}'
date: ${año}-${mes < 10 ? '0' + mes : mes}-${día < 10 ? '0' + día : día}
permalink: /${item.fullSlug}/
---

${contenidoCorregido}`

      // Creamos cada fichero
      fs.writeFileSync(`md_files/${item.slug}.md`, data)
    }
  }
);