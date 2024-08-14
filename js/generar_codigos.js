    // Generar el valor del campo bulto material en base a los campos nPlanilla y nGuia
    document.getElementById('nPlanilla').addEventListener('change', function() {
        var nPlanilla = this.value;
        var nGuia = document.getElementById('nGuia').value;
        var bultoMaterialValue = 'C' + nPlanilla + nGuia;
        var bultos = document.getElementById('rusulto_cant_bult').value;
        var unixbultos = document.getElementById('unidad_bultos').value;
        document.getElementById('codigo_bulto_material').value = bultoMaterialValue;

    });

    document.getElementById('nGuia').addEventListener('change', function() {
        var nPlanilla = document.getElementById('nPlanilla').value;
        var nGuia = this.value;
        var bultoMaterialValue = 'C' + nPlanilla + nGuia;
        document.getElementById('codigo_bulto_material').value = bultoMaterialValue;
    });

    // Asegura que solo se puedan ingresar valores numéricos y limita la longitud a 10 caracteres en el campo nGuia
    nGuia.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
        } else if (value.length > 10) {
            e.target.value = value.slice(0, 10); // Limita la longitud a 10 caracteres
        }
    });

//mas validación de númericos 
document.addEventListener('DOMContentLoaded', function() {
    var cantBultos = document.getElementById('rusulto_cant_bult');
    var unidBultos = document.getElementById('unidad_bultos');

    // Validación para "Cant. Bultos"
    cantBultos.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
        }
    });

    // Validación para "Unid. x Bultos"
    unidBultos.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
        }
    });
});

    // Cálculo de la cantidad recibida
    document.addEventListener('DOMContentLoaded', function() {
        var rusultoCantBult = document.getElementById('rusulto_cant_bult');
        var unidadBultos = document.getElementById('unidad_bultos');
        var cantRec = document.getElementById('cant_rec');

        function calcularCantidadRecibida() {
            var cantBultos = parseFloat(rusultoCantBult.value) || 0;
            var unidadBultosValue = parseFloat(unidadBultos.value) || 0;
            var totalCantidad = cantBultos * unidadBultosValue;
            cantRec.value = totalCantidad;
        }

        rusultoCantBult.addEventListener('input', calcularCantidadRecibida);
        unidadBultos.addEventListener('input', calcularCantidadRecibida);
    });
