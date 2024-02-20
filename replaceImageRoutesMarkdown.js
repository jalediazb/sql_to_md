module.exports = function (texto) {
    var regex = /(!\[.*?\]\()([^)]+)(\))/g;

    var resultado = texto.replace(regex, function(match, inicio, url, fin) {
        // Extraer el nombre del archivo y su extensión desde la URL
        var nombreArchivo = url.substring(url.lastIndexOf('/') + 1);
        
        // Construir la nueva URL con el formato deseado
        var nuevaURL = nombreArchivo;
        
        // Devolver el texto modificado
        return inicio + nuevaURL + fin;
      });
      
      return resultado;
}