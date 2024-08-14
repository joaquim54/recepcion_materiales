document.addEventListener('DOMContentLoaded', function() {
    // Obtiene las referencias a los elementos del DOM
    var nPlanilla = document.getElementById('nPlanilla');
    var btnBusquedaOrden = document.getElementById('btnBusquedaOrden');
    var tipo = document.getElementById('tipo');
    var bodegaOrigen = document.getElementById('bodegaOrigen');
    var bodegaDestino = document.getElementById('bodegaDestino');
    var proveedor = document.getElementById('proveedor'); 
    var nGuia = document.getElementById('nGuia');
    var btnAgregarMaterial = document.getElementById('btnAgregarMaterial');

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

    nPlanilla.addEventListener('input', function(e) {
        var value = e.target.value;
        if (/[^0-9]/.test(value)) {
            e.target.value = value.replace(/[^0-9]/g, '');
        }
        toggleBusquedaButton();
    });

    nPlanilla.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            toggleBusquedaButton();
        }
    });

    btnBusquedaOrden.addEventListener('click', function() {
        var nPlanillaValue = nPlanilla.value.trim();
    
        $.ajax({
            url: 'ajax/busqueda_compra.php',
            type: 'POST',
            data: {
                nPlanilla: nPlanillaValue 
            },
            success: function(response) {
                //console.log(response); objeto JSON en consola para ver si se esta recibiendo la informacion (planilla ya usada)
                try {
                    var result = JSON.parse(response);
                } catch (e) {
                    console.error("Error parsing JSON: ", e);
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: "Error en la búsqueda de la compra",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
    
                var data = result.data || []; 
                var bodegasOrigen = result.bodegas_origen || []; 
                var bodegasDestino = result.bodegas_destino || []; 
                var proveedores = result.proveedores || []; 
                var guia = result.nro_guia || [];

    
                tipo.innerHTML = '<option value="" disabled selected>Seleccione</option>';
                bodegaOrigen.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                bodegaDestino.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                proveedor.innerHTML = '<option value="" disabled selected>Elija un proveedor</option>'; 
    
                var addedOptions = new Set();
    
                if (result.error) {
                    alert(result.error); // Muestra un mensaje de error si hay algún problema
                } else {
                    // Llenado del selector Tipo
                    var addedOptions = new Set();
                    data.forEach(function(item) {
                        if (item.des_movimiento && item.cod_mov && !addedOptions.has(item.cod_mov)) {
                            var option = document.createElement('option');
                            option.value = item.cod_mov;
                            option.text = item.des_movimiento;
                            tipo.appendChild(option);
                            addedOptions.add(item.cod_mov);
                        }
                    });
    
                    // Llenado del selector Bodegas Origen
                    bodegasOrigen.forEach(function(bodega) {
                        if (bodega.nombre && bodega.codigo) { 
                            var option = document.createElement('option');
                            option.value = bodega.codigo;
                            option.text = bodega.nombre;
                            bodegaOrigen.appendChild(option);
                        }
                    });
    
                    // Llenado del selector Bodegas Destino
                    bodegasDestino.forEach(function(bodega) {
                        if (bodega.nombre && bodega.codigo) { 
                            var option = document.createElement('option');
                            option.value = bodega.codigo;
                            option.text = bodega.nombre;
                            bodegaDestino.appendChild(option);
                        }
                    });
    
                    // Llenado del selector Proveedores
                    proveedores.forEach(function(prov) {
                        if (prov.nombre && prov.codigo) { 
                            var option = document.createElement('option');
                            option.value = prov.codigo;
                            option.text = prov.nombre;
                            proveedor.appendChild(option);
                        }
                    });

                        if (guia.length > 0) {
                            nGuia.value = guia[0]; 
                        } else {
                            nGuia.value = ''; 
                        }
                    
    
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
    
    
    


    var correlativoGlobal = 1; // Definir una variable global para el correlativo

    function agregarMateriales() {
        var cantBultos = parseInt(document.getElementById('rusulto_cant_bult').value, 10);
        var tableBody = document.querySelector('#mostrar_table tbody');
        var unidadBultosValue = document.getElementById('unidad_bultos').value;
    
        if (!isNaN(cantBultos) && cantBultos > 0) {
            var bultosAgregados = 0;
            for (var i = 0; i < cantBultos; i++) {
                (function(index) {
                    var correlativo = correlativoGlobal++; // Usar y luego incrementar el correlativo global
                    var codigoBultoMaterial = 'C' + document.getElementById('nPlanilla').value + document.getElementById('nGuia').value;
                    var idBultoMaterial = codigoBultoMaterial + '-' + correlativo;
    
                    var bultoData = {
                        zona: document.getElementById('zona').value,
                        nPlanilla: document.getElementById('nPlanilla').value,
                        tipo: document.getElementById('tipo').value,
                        fecha: document.getElementById('fecha').value,
                        bodegaOrigen: document.getElementById('bodegaOrigen').value,
                        bodegaDestino: document.getElementById('bodegaDestino').value,
                        proveedor: document.getElementById('proveedor').value,
                        nGuia: document.getElementById('nGuia').value,
                        code_material: document.getElementById('code_material').value,
                        id_embalaje: document.getElementById('id_embalaje').value,
                        codigo_bulto_material: codigoBultoMaterial,
                        id_bulto_material: idBultoMaterial,
                        correlativo: correlativo,
                        fechaVencimiento: document.getElementById('fechaVencimiento').value,
                        rusulto_cant_bult: document.getElementById('rusulto_cant_bult').value,
                        unidad_bultos: unidadBultosValue,
                        cant_rec: document.getElementById('cant_rec').value,
                        valor: $('#table-materiales').find('tr').filter(function() {
                            return $(this).find('td:first').text() === document.getElementById('code_material').value;
                        }).find('td:eq(3)').text(),
                        unidad: $('#table-materiales').find('tr').filter(function() {
                            return $(this).find('td:first').text() === document.getElementById('code_material').value;
                        }).find('td:eq(2)').text()
                    };
    
                    $.ajax({
                        url: 'ajax/ajax_insert.php',
                        type: 'POST',
                        data: bultoData,
                        success: function(response) {
                            //console.log('Bulto insertado:', response); en caso de no funcionar depurar con este console log para ver si se esta insertando el bulto o  cual error arroja sql server
                            bultosAgregados++;
    
                            // Actualizar la tabla del front después de insertar cada bulto
                            var row = document.createElement('tr');
                            var codigoCell = document.createElement('td');
                            var descripcionCell = document.createElement('td');
                            var unidadCell = document.createElement('td');
                            var cantidadCell = document.createElement('td');
                            var valorCompraCell = document.createElement('td');
                            var totalCell = document.createElement('td');
                            var correlativoCell = document.createElement('td');
                            var idOrdenCell = document.createElement('td');
                            var fechaVencCell = document.createElement('td');
                            var idBultoCell = document.createElement('td');
                            var imprimirCell = document.createElement('td');
    
                            // Asignar valores a las celdas 
                            codigoCell.textContent = bultoData.code_material;
                            descripcionCell.textContent = bultoData.id_embalaje;
                            unidadCell.textContent = bultoData.unidad;
                            cantidadCell.textContent = unidadBultosValue; 
                            valorCompraCell.textContent = bultoData.valor;
                            totalCell.textContent = '0';
                            correlativoCell.textContent = correlativo;
                            idOrdenCell.textContent = '0'; 
                            fechaVencCell.textContent = bultoData.fechaVencimiento;
                            idBultoCell.textContent = idBultoMaterial;
                            imprimirCell.innerHTML = '<button type="button" id="btnImprimir" name="btnImprimir" class="btn btn-primary btnImprimir">Imprimir</button>';
    
                            // Añadir las celdas a la fila de la tabla 
                            row.appendChild(codigoCell);
                            row.appendChild(descripcionCell);
                            row.appendChild(unidadCell);
                            row.appendChild(cantidadCell);
                            row.appendChild(valorCompraCell);
                            row.appendChild(totalCell);
                            row.appendChild(correlativoCell);
                            row.appendChild(idOrdenCell);
                            row.appendChild(fechaVencCell);
                            row.appendChild(idBultoCell);
                            row.appendChild(imprimirCell);
    
                            // Añade la fila a la tabla
                            tableBody.appendChild(row);
    
                            // Abrir el collapse de la tabla si no está abierto
                            $('#mostrar_table').collapse('show');
    
                            // Mostrar mensaje de éxito cuando todos los bultos se hayan agregado
                            if (bultosAgregados === cantBultos) {
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: "Material agregado correctamente",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error('Error en la inserción del bulto:', status, error);
                            Swal.fire({
                                position: "center",
                                icon: "error",
                                title: "Error en la inserción de material",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    });
                })(i); // Inmediatamente invocar la función con el índice actual
            }
    
            // Limpiar todos los elementos para no producir errores
            document.getElementById('rusulto_cant_bult').value = '';
            document.getElementById('unidad_bultos').value = '';
            document.getElementById('cant_rec').value = '';
            document.getElementById('fechaVencimiento').value = document.getElementById('fecha').value;
            document.getElementById('code_material').value = '';
            document.getElementById('id_embalaje').value = '';
        }
    }
    
    btnAgregarMaterial.addEventListener('click', agregarMateriales);
    

    function habilitarAgregarMateriales() {
        if (document.getElementById('nPlanilla').value.trim() !== "" &&
            document.getElementById('zona').value.trim() !== "" &&
            document.getElementById('tipo').value.trim() !== "" &&
            document.getElementById('fecha').value.trim() !== "" &&
            document.getElementById('bodegaDestino').value.trim() !== "" &&
            document.getElementById('proveedor').value.trim() !== "" &&
            document.getElementById('nGuia').value.trim() !== "" &&
            document.getElementById('code_material').value.trim() !== "" &&
            document.getElementById('id_embalaje').value.trim() !== "" &&
            document.getElementById('fechaVencimiento').value.trim() !== "" &&
            document.getElementById('rusulto_cant_bult').value.trim() !== "" &&
            document.getElementById('unidad_bultos').value.trim() !== "" &&
            document.getElementById('cant_rec').value.trim() !== "") {
                document.getElementById('btnAgregarMaterial').removeAttribute('disabled');
            } else {
                document.getElementById('btnAgregarMaterial').setAttribute('disabled', 'disabled');
            }
    }
    
    // habilitar el botón de guardar
    const campos = ['#nPlanilla', '#zona', '#tipo', '#fecha', '#bodegaDestino', '#proveedor', '#nGuia', '#code_material', '#id_embalaje', '#fechaVencimiento', '#rusulto_cant_bult', '#unidad_bultos', '#cant_rec'];
    campos.forEach(selector => {
        document.querySelector(selector).addEventListener('input', habilitarAgregarMateriales);
    });
    
});


//manejo del modal de los proveedores
$(document).ready(function() {
    $('#modal-tipo-proveedor').on('shown.bs.modal', function () {
        if (!$.fn.DataTable.isDataTable('#table-proveedores')) {
            $('#table-proveedores').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "lib/DataTables/es_es.json" // URL para la localización en español
                }
            });
        }
    });

    // Manejar la selección del proveedor
    $(document).on('click', '.seleccionar-proveedor', function() {
        var CodigoCliente = $(this).data('codigo');
        var NombreCliente = $(this).data('nombre');

        $('#proveedor').val(CodigoCliente);
        $('#nom_proveedor').val(NombreCliente);

        $('#modal-tipo-proveedor').modal('hide'); // Oculta el modal después de seleccionar el proveedor
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
                    "url": "lib/DataTables/es_es.json" // URL para la localización en español
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

document.addEventListener('DOMContentLoaded', function() {
    // Obtiene las referencias a los elementos del DOM
    var rusultoCantBult = document.getElementById('rusulto_cant_bult');
    var unidadBultos = document.getElementById('unidad_bultos');
    var cantRec = document.getElementById('cant_rec');

    function calcularCantidadRecibida() {
        var cantBultos = parseFloat(rusultoCantBult.value) || 0;
        var unidadBultosValue = parseFloat(unidadBultos.value) || 0;
        var totalCantidad = cantBultos * unidadBultosValue;
        cantRec.value = totalCantidad;
    }

    // Asignar el evento 'input' a los campos rusulto_cant_bult y unidad_bultos
    rusultoCantBult.addEventListener('input', calcularCantidadRecibida);
    unidadBultos.addEventListener('input', calcularCantidadRecibida);
});



document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    var nPlanilla = document.getElementById('nPlanilla');
    var btnLimpiar = document.getElementById('btnLimpiar');

    btnLimpiar.addEventListener('click', function() {
        // Seleccionar todos los campos de entrada y selects dentro del formulario
        var inputs = document.querySelectorAll('input:not(#nPlanilla), select');
        
        inputs.forEach(function(input) {
            if (input.type === 'checkbox') {
                input.checked = false; // Deseleccionar los checkboxes
            } else {
                input.value = ''; // Limpiar el valor de los campos de entrada y selects
            }
        });

        // Ocultar el collapse si está abierto
        $('#mostrar').collapse('hide');
        $('#mostrar_table').collapse('hide');
    });
});

// Generar QR y mostrar en modal
$(document).on('click', '.btnImprimir', function() {
    var row = $(this).closest('tr');
    var codigoProducto = row.find('td:eq(0)').text();
    var cantidad = row.find('td:eq(3)').text();
    var lote = row.find('td:eq(9)').find('input').val(); // Asumiendo que es un input
    var fecha = row.find('td:eq(8)').text();

    // Obtén los valores correctos de los elementos HTML
    var descripcion = $('#id_embalaje').val(); // Usando val() para inputs
    var nPlanilla = $('#nPlanilla').val();
    var nGuia = $('#nGuia').val();
    var codigoBultoMaterial = $('#codigo_bulto_material').val();
    var proveedor = $('#proveedor').find('option:selected').text(); // Usando find() para selects

    var qrData = {"CodigoProducto": codigoProducto, "Cantidad": cantidad, "Lote": lote, "Fecha": fecha};
    var qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(JSON.stringify(qrData))}`;

    $('#qrImage').attr('src', qrImageUrl);
    $('#modal-titulo').text(`${familia}`);
    $('#modal-empresa').text(`PACKIG MERQUEN SPA`);
    $('#modal-codProducto').text(`Cod.Productor: ${codigoProducto}`);
    $('#modal-descProducto').text(`Descripción: ${descripcion}`);
    $('#modal-lote-bulto').text(`Lote/Bulto: ${nPlanilla} - ${nGuia} - ${codigoBultoMaterial}`);
    $('#modal-proveedor').text(`${proveedor}`);
    $('#modal-cantidad').text(`Cant: ${cantidad}`);
    $('#modal-fechaRec').text(`Fecha: ${fecha}`);

    $('#qrModal').modal('show');
});

