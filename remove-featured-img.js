module.exports = function (featuredImg, content) {
   
        const regexImagen = new RegExp(`!\\[[^\\]]*\\]\\(.*?${featuredImg}\\)`, 'g');
        console.log(regexImagen)
        const contenidoSinImagen = content.replace(regexImagen, '');
        return contenidoSinImagen;
    
}