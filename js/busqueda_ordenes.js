btnBusquedaOrden.addEventListener('click', function() {
    var nPlanillaValue = nPlanilla.value.trim();

    $.ajax({
        url: 'ajax/busqueda_compra.php',
        type: 'POST',
        data: {
            nPlanilla: nPlanillaValue 
        },
        success: function(response) {
            try {
                btnBusquedaOrden.addEventListener('click', function() {
                    var nPlanillaValue = nPlanilla.value.trim();
                
                    $.ajax({
                        url: 'ajax/busqueda_compra.php',
                        type: 'POST',
                        data: {
                            nPlanilla: nPlanillaValue 
                        },
                        success: function(response) {
                            try {
                                var result = JSON.parse(response);
                                if (result.existePlanilla) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Planilla ya utilizada',
                                        text: 'La planilla que intentas buscar ya ha sido utilizada.'
                                    });
                                } else {
                                    // Código existente para manejar respuesta si la planilla no ha sido utilizada
                                }
                            } catch (e) {
                                console.error("Error parsing JSON: ", e);
                                Swal.fire({
                                    position: "center",
                                    icon: "error",
                                    title: "Error en la respuesta",
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        }
                    });
                });
                
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
                alert(result.error); 
            } else {
                data.forEach(function(item) {
                    if (item.des_movimiento && item.cod_mov && !addedOptions.has(item.cod_mov)) {
                        var option = document.createElement('option');
                        option.value = item.cod_mov;
                        option.text = item.des_movimiento;
                        tipo.appendChild(option);
                        addedOptions.add(item.cod_mov);
                    }
                });

                bodegasOrigen.forEach(function(bodega) {
                    if (bodega.nombre && bodega.codigo) { 
                        var option = document.createElement('option');
                        option.value = bodega.codigo;
                        option.text = bodega.nombre;
                        bodegaOrigen.appendChild(option);
                    }
                });

                bodegasDestino.forEach(function(bodega) {
                    if (bodega.nombre && bodega.codigo) { 
                        var option = document.createElement('option');
                        option.value = bodega.codigo;
                        option.text = bodega.nombre;
                        bodegaDestino.appendChild(option);
                    }
                });

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

                var codigoBultoMaterial = 'C' + nPlanillaValue + nGuia.value;
                document.getElementById('codigo_bulto_material').value = codigoBultoMaterial;

                if (addedOptions.size > 0 || bodegasOrigen.length > 0 || bodegasDestino.length > 0 || proveedores.length > 0) { 
                    $('#mostrar').collapse('show');
                }

                if (data.length > 0) {
                    cargarMateriales(nPlanillaValue);  // Llama a la función para cargar materiales
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error Ajax:', status, error); 
        }
    });
});

function cargarMateriales(nPlanilla) {
    $.ajax({
        url: 'ajax/llenar_tabla_print.php',
        type: 'POST',
        data: {
            nPlanilla: nPlanilla
        },
        success: function(response) {
           // console.log("Respuesta de .php:", response);
            try {
                var result = JSON.parse(response);
                if (result.error) {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: result.error,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
                
                var materiales = result.data || [];
                var tableBody = document.querySelector('#mostrar_table tbody');
                tableBody.innerHTML = '';

                materiales.forEach(function(material) {
                    var row = document.createElement('tr');

                    var codigoCell = document.createElement('td');
                    codigoCell.textContent = material.codigo;
                    row.appendChild(codigoCell);

                    var descripcionCell = document.createElement('td');
                    descripcionCell.textContent = material.descripcion;
                    row.appendChild(descripcionCell);

                    var unidadCell = document.createElement('td');
                    unidadCell.textContent = material.COD_UNID;
                    row.appendChild(unidadCell);

                    var cantidadCell = document.createElement('td');
                    cantidadCell.textContent = material.CAN_REC;
                    row.appendChild(cantidadCell);

                    var valorCompraCell = document.createElement('td');
                    valorCompraCell.textContent = material.valor_compra;
                    row.appendChild(valorCompraCell);

                    var totalCell = document.createElement('td');
                    totalCell.textContent = material.total;
                    row.appendChild(totalCell);

                    var correlativoCell = document.createElement('td');
                    correlativoCell.textContent = material.correlativo;
                    row.appendChild(correlativoCell);

                    var idOrdenCell = document.createElement('td');
                    idOrdenCell.textContent = material.id_orden;
                    row.appendChild(idOrdenCell);
                    
                    var fechavencimientoCell = document.createElement('td');
                    fechavencimientoCell.textContent = material.fecha_vencimiento;
                    row.appendChild(fechavencimientoCell);

                    var idBultoCell = document.createElement('td');
                    idBultoCell.textContent = material.id_bulto;
                    row.appendChild(idBultoCell);

                    var imprimirCell = document.createElement('td');
                    imprimirCell.innerHTML = '<button type="button" class="btn btn-primary btnImprimir">Imprimir</button>';
                    row.appendChild(imprimirCell);

                    tableBody.appendChild(row);
                });

                if (materiales.length > 0) {
                    $('#mostrar_table').collapse('show'); // Mostrar la tabla si hay materiales
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error al cargar los materiales",
                    showConfirmButton: false,
                    timer: 1500
                });
                return;
            }
        },
        error: function(xhr, status, error) {
            console.error('Error Ajax:', status, error);
        }
    });
}

