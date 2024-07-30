// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtiene las referencias a los elementos del DOM
    var nPlanilla = document.getElementById('nPlanilla');
    var btnBusquedaOrden = document.getElementById('btnBusquedaOrden');
    var tipo = document.getElementById('tipo');
    var bodegaOrigen = document.getElementById('bodegaOrigen');
    var bodegaDestino = document.getElementById('bodegaDestino');
    var proveedor = document.getElementById('proveedor'); 
    var nGuia = document.getElementById('nGuia');

    // Habilita o deshabilita el botón de búsqueda y el campo tipo dependiendo si hay un valor en nPlanilla
    function toggleBusquedaButton() {
        var planillaValue = nPlanilla.value.trim();
        if (planillaValue !== "") {
            tipo.removeAttribute('disabled');
            btnBusquedaOrden.removeAttribute('disabled');
        } else {
            tipo.setAttribute('disabled', 'disabled');
            btnBusquedaOrden.setAttribute('disabled', 'disabled');
        }
    }

    // Asegura que solo se puedan ingresar valores numéricos en el campo nPlanilla
    nPlanilla.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, '');
        }
        toggleBusquedaButton();
    });

    // Llama a la función toggleBusquedaButton cuando se presiona Enter en el campo nPlanilla
    nPlanilla.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            toggleBusquedaButton();
        }
    });

    // Realiza una búsqueda AJAX cuando se hace clic en el botón de búsqueda
    btnBusquedaOrden.addEventListener('click', function() {
        var nPlanillaValue = nPlanilla.value.trim();

        $.ajax({
            url: 'ajax/busqueda_compra.php', // URL del script PHP para manejar la solicitud
            type: 'POST', // Método de solicitud
            data: {
                nPlanilla: nPlanillaValue // Datos enviados al servidor
            },
            success: function(response) {
                var result = JSON.parse(response); // Parsear la respuesta JSON
                var data = result.data; // Datos del movimiento
                var bodegasOrigen = result.bodegas_origen; // Bodegas de origen
                var bodegasDestino = result.bodegas_destino; // Bodegas de destino
                var proveedores = result.proveedores; // Proveedores
                tipo.innerHTML = '<option value="" disabled selected>Seleccione</option>';
                bodegaOrigen.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                bodegaDestino.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                proveedor.innerHTML = '<option value="" disabled disabled selected>Elija un proveedor</option>'; 

                var addedOptions = new Set();

                if (result.error) {
                    alert(result.error); // Muestra un mensaje de error si hay algún problema
                } else {
                    data.forEach(function(item) {
                        var optionValue = item.des_movimiento;
                        if (!addedOptions.has(optionValue)) {
                            addedOptions.add(optionValue);
                            var option = document.createElement('option');
                            option.value = item.cod_mov;
                            option.text = optionValue;
                            tipo.appendChild(option);
                        }
                    });

                    bodegasOrigen.forEach(function(bodega) {
                        var option = document.createElement('option');
                        option.value = bodega;
                        option.text = bodega;
                        bodegaOrigen.appendChild(option);
                    });

                    bodegasDestino.forEach(function(bodega) {
                        var option = document.createElement('option');
                        option.value = bodega;
                        option.text = bodega;
                        bodegaDestino.appendChild(option);
                    });

                    // Añadir proveedores a la lista desplegable
                    proveedores.forEach(function(prov) {
                        var option = document.createElement('option');
                        option.value = prov;
                        option.text = prov;
                        proveedor.appendChild(option);
                    });

                    // Abrir el collapse si hay opciones disponibles
                    if (addedOptions.size > 0 || bodegasOrigen.length > 0 || bodegasDestino.length > 0 || proveedores.length > 0) { 
                        $('#mostrar').collapse('show');
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Error Ajax:', status, error); // Manejo de errores
            }
        });
    });
});

// Inicializa el modal y la tabla de materiales cuando el modal se muestra
$(document).ready(function() {
    $('#modal-tipo-material').on('shown.bs.modal', function () {
        if (!$.fn.DataTable.isDataTable('#table-materiales')) {
            $('#table-materiales').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json" // URL para la localización en español
                }
            });
        }
    });

    // Manejar la selección del material
    $(document).on('click', '.seleccionar-material', function() {
        var subitem = $(this).data('subitem');
        var descripcion = $(this).data('descripcion');

        $('#code_material').val(subitem);
        $('#id_embalaje').val(descripcion);

        $('#modal-tipo-material').modal('hide'); // Oculta el modal después de seleccionar el material
    });
});

// Genera el valor del campo bulto material en base a los campos nPlanilla y nGuia
document.getElementById('nPlanilla').addEventListener('change', function() {
    var nPlanilla = this.value;
    var nGuia = document.getElementById('nGuia').value;
    var bultoMaterialValue = 'C' + nPlanilla + nGuia;
    console.log(bultoMaterialValue);
    document.getElementById('codigo_bulto_material').value = bultoMaterialValue;
});

document.getElementById('nGuia').addEventListener('change', function() {
    var nPlanilla = document.getElementById('nPlanilla').value;
    var nGuia = this.value;
    var bultoMaterialValue = 'C' + nPlanilla + nGuia;
    console.log(bultoMaterialValue);
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
