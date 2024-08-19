var correlativoGlobal = 1; // Definir una variable global para el correlativo

async function agregarMateriales() {
    var cantBultos = parseInt(document.getElementById('rusulto_cant_bult').value, 10);
    var tableBody = document.querySelector('#mostrar_table tbody');
    var unidadBultosValue = document.getElementById('unidad_bultos').value;

    if (!isNaN(cantBultos) && cantBultos > 0) {
        var bultosAgregados = 0;
        for (var i = 0; i < cantBultos; i++) {
            var correlativo = correlativoGlobal++; 
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
                }).first().find('td:eq(3)').text(),  
                unidad: $('#table-materiales').find('tr').filter(function() {
                    return $(this).find('td:first').text() === document.getElementById('code_material').value;
                }).first().find('td:eq(2)').text()
            };

            try {
                await $.ajax({
                    url: 'ajax/ajax_insert.php',
                    type: 'POST',
                    data: bultoData,
                    success: function(response) {
                        console.log('Respuesta del servidor:', response);
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

                        // Añadir la fila a la tabla
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
            } catch (error) {
                console.error('Error en la inserción del bulto:', error);
            }
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

// Asociar el evento click al botón de agregar materiales
document.getElementById('btnAgregarMaterial').addEventListener('click', agregarMateriales);
