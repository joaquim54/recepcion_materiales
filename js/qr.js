function generarCodigoQR(texto) {
    // Crear un objeto QRCode
    var qr = qrcode(0, 'L');
    qr.addData(texto); 
    qr.make(); 

    var codigoQR = document.getElementById('qr');

    codigoQR.innerHTML = qr.createImgTag();
}

document.addEventListener("DOMContentLoaded", function() {
var texto = "en esta variable se pasan los datos a generar el codigo QR";
generarCodigoQR(texto);
});
