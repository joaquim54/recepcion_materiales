// dinamismo en la web para agregar valores a los campos de la recepción de materiales
document.addEventListener('DOMContentLoaded', function() {
    var nPlanilla = document.getElementById('nPlanilla');
    var btnBusquedaOrden = document.getElementById('btnBusquedaOrden');
    var tipo = document.getElementById('tipo');
    var bodegaOrigen = document.getElementById('bodegaOrigen');
    var bodegaDestino = document.getElementById('bodegaDestino');
    var proveedor = document.getElementById('proveedor'); 
    var nGuia = document.getElementById('nGuia');

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
//solo númericos
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
//Ajax para siempre permanecer en la misma página como en sdt
    btnBusquedaOrden.addEventListener('click', function() {
        var nPlanillaValue = nPlanilla.value.trim();

        $.ajax({
            url: 'ajax/busqueda_compra.php',
            type: 'POST',
            data: {
                nPlanilla: nPlanillaValue
            },
            success: function(response) {
                var result = JSON.parse(response);
                var data = result.data;
                var bodegasOrigen = result.bodegas_origen;
                var bodegasDestino = result.bodegas_destino;
                var proveedores = result.proveedores; 
                tipo.innerHTML = '<option value="" disabled selected>Seleccione</option>';
                bodegaOrigen.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                bodegaDestino.innerHTML = '<option value="" disabled selected>Elija una bodega</option>';
                proveedor.innerHTML = '<option value="" disabled disabled selected>Elija un proveedor</option>'; 

                var addedOptions = new Set();

                if (result.error) {
                    alert(result.error);
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
                console.error('Error Ajax:', status, error);
            }
        });
    });
});

$(document).ready(function() {
    $('#modal-tipo-material').on('shown.bs.modal', function () {
        if (!$.fn.DataTable.isDataTable('#table-materiales')) {
            $('#table-materiales').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "//cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
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

        $('#modal-tipo-material').modal('hide');
    });
});
// genera el bulto material en base a que se llene número de planilla
document.getElementById('nPlanilla').addEventListener('change', function() {
    var nPlanilla = this.value;
    var bultoMaterialValue = 'C' + nPlanilla;
    console.log(bultoMaterialValue);
    document.getElementById('codigo_bulto_material').value = bultoMaterialValue;
});

