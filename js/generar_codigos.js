// Generar el valor del campo bulto material en base a los campos nPlanilla y nGuia
document.getElementById('nPlanilla').addEventListener('change', function() {
    var nPlanilla = this.value;
    var nGuia = document.getElementById('nGuia').value;
    var bultoMaterialValue = 'C' + nPlanilla + nGuia;
    document.getElementById('codigo_bulto_material').value = bultoMaterialValue;
});

document.getElementById('nGuia').addEventListener('change', function() {
    var nPlanilla = document.getElementById('nPlanilla').value;
    var nGuia = this.value;
    var bultoMaterialValue = 'C' + nPlanilla + nGuia;
    document.getElementById('codigo_bulto_material').value = bultoMaterialValue;
});

// Solo permite valores numéricos y limita la longitud a 10 caracteres en el campo nGuia
var nGuia = document.getElementById('nGuia');
nGuia.addEventListener('input', function(e) {
    var value = e.target.value;
    if (/[^0-9]/.test(value)) {
        e.target.value = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    } else if (value.length > 10) {
        e.target.value = value.slice(0, 10); // Limita la longitud a 10 caracteres
    }
});

// Validación de números para "Cant. Bultos" y "Unid. x Bultos"
document.addEventListener('DOMContentLoaded', function() {
    var cantBultos = document.getElementById('rusulto_cant_bult');
    var unidBultos = document.getElementById('unidad_bultos');

    // Permitir números y caracteres de decimales (punto y coma)
    function validarDecimal(input) {
        input.addEventListener('input', function(e) {
            var value = e.target.value;
            if (/[^0-9.,]/.test(value)) {
                e.target.value = value.replace(/[^0-9.,]/g, ''); // Permite solo números, comas y puntos
            }
        });
    }

    validarDecimal(cantBultos);
    validarDecimal(unidBultos);
});

// Cálculo de la cantidad recibida
document.addEventListener('DOMContentLoaded', function() {
    var rusultoCantBult = document.getElementById('rusulto_cant_bult');
    var unidadBultos = document.getElementById('unidad_bultos');
    var cantRec = document.getElementById('cant_rec');
    var nGuia = document.getElementById('nGuia');
    
    function calcularCantidadRecibida() {
        var cantBultos = parseFloat(rusultoCantBult.value.replace(',', '.')) || 0;
        var unidadBultosValue = parseFloat(unidadBultos.value.replace(',', '.')) || 0;
        var totalCantidad = cantBultos * unidadBultosValue;

        cantRec.value = formatNumber(totalCantidad);
    }

    function formatNumber(number) {
        var integerPart = Math.floor(number);
        var decimalPart = number % 1;

        var formattedNumber = integerPart.toLocaleString('de-DE');

        if (decimalPart !== 0) {
            var decimalString = decimalPart.toFixed(2).substring(2);
            if (decimalString !== "00") {
                formattedNumber += ',' + decimalString.replace(/0+$/, '');
            } else {
                formattedNumber += ',' + decimalString;
            }
        } else {
            formattedNumber += ',00';
        }

        return formattedNumber;
    }

    rusultoCantBult.addEventListener('input', calcularCantidadRecibida);
    unidadBultos.addEventListener('input', calcularCantidadRecibida);

    unidadBultos.addEventListener('blur', function() {
        var inputValue = unidadBultos.value.replace(/\./g, '').replace(',', '.');
        var unidadBultosValue = parseFloat(inputValue) || 0;
        unidadBultos.value = formatNumber(unidadBultosValue);
    });

    nGuia.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, ''); 
        } else if (value.length > 10) {
            e.target.value = value.slice(0, 10); 
        }
    });

    var cantBultos = document.getElementById('rusulto_cant_bult');
    var unidBultos = document.getElementById('unidad_bultos');

    cantBultos.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, ''); 
        }
    });

    unidBultos.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9,]/.test(value)) {
            e.target.value = value.replace(/[^0-9,]/g, ''); 
        }
    });
});