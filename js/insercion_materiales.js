var correlativoGlobal = 1; // variable global para el correlativo

async function agregarMateriales() {
    var cantBultos = parseInt(document.getElementById('rusulto_cant_bult').value, 10);
    var tableBody = document.querySelector('#mostrar_table tbody');
    var unidadBultosValue = document.getElementById('unidad_bultos').value;

    if (nPlanilla.value.trim() === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe ingresar un número de planilla',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (tipo.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar un tipo de orden',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (zona.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar una zona',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (fecha.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar una fecha',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (bodegaDestino.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar una bodega destino',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (nGuia.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe ingresar un número de guía',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (proveedor.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar un proveedor',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (id_embalaje.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar un embalaje',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (fechaVencimiento.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar una fecha de vencimiento',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (rusulto_cant_bult.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe ingresar una cantidad de bultos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    if (unidad_bultos.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Campo requerido',
            text: 'Debe seleccionar una unidad de bultos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    if (!isNaN(cantBultos) && cantBultos > 0) {
        var bultosAgregados = 0;
        for (var i = 0; i < cantBultos; i++) {
            var correlativo = correlativoGlobal++; 
            var codigoBultoMaterial = 'C' + document.getElementById('nPlanilla').value + document.getElementById('nGuia').value;
            var idBultoMaterial = codigoBultoMaterial + '-' + correlativo;

            var bultoData = {
                zona: document.getElementById('zona').value,
                responsable: document.getElementById('responsable').value,
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
                        if (response.includes('clave duplicada')) {
                            alert("Favor crear nuevamente la planilla de despacho, ya que se ha agregado un nuevo material");
                            window.location.reload();
                        } else if (response === 'mal') {
                            alert("Favor crear nuevamente la planilla de despacho, ya que se ha agregado un nuevo material");
                            window.location.reload();
                        } 
                        bultosAgregados++;
                        // Actualizar la tabla del front después de cada insert
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

                        // sweet alert de exito
                        if (bultosAgregados === cantBultos) {
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "Material agregado correctamente",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                       // mandarImpresion(); //eliminar en caso de solicitarse, esto es para que se imprima automaticamente al agregar un material, ojo que, si se elimina, se debe eliminar la funcion mandarImpresion() para mantener el orden en el codigo, aparte hacer un commit con eso 
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

        // Limpiar para no producir errores
        document.getElementById('rusulto_cant_bult').value = '';
        document.getElementById('unidad_bultos').value = '';
        document.getElementById('cant_rec').value = '';
        document.getElementById('fechaVencimiento').value = document.getElementById('fecha').value;
        document.getElementById('code_material').value = '';
        document.getElementById('id_embalaje').value = '';
    }
}

document.getElementById('btnAgregarMaterial').addEventListener('click', agregarMateriales);


function mandarImpresion(){
    $('#btnImprimirTodo').click();
}