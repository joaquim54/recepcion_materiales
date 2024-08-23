var materialesSeleccionados = [];

// Manejo del modal de los proveedores
$(document).ready(function() {
    $('#modal-tipo-proveedor').on('shown.bs.modal', function () {
        if (!$.fn.DataTable.isDataTable('#table-proveedores')) {
            $('#table-proveedores').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "lib/DataTables/es_es.json"
                }
            });
        }
    });

    $(document).on('click', '.seleccionar-proveedor', function() {
        var CodigoCliente = $(this).data('codigo');
        var NombreCliente = $(this).data('nombre');

        $('#proveedor').val(CodigoCliente);
        $('#nom_proveedor').val(NombreCliente);

        $('#modal-tipo-proveedor').modal('hide');
    });
});

// Manejo del modal de materiales
$(document).ready(function() {
    $('#modal-tipo-material').on('shown.bs.modal', function () {
        if (!$.fn.DataTable.isDataTable('#table-materiales')) {
            $('#table-materiales').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "lib/DataTables/es_es.json"
                }
            });
        }
    });

    $(document).on('click', '.seleccionar-material', function() {
        var subitem = $(this).data('subitem');
        var descripcion = $(this).data('descripcion');
        var familia = $(this).data('familia');

        // Guardar el material seleccionado en un array, arreglo especial para solucionar el problema de la familia exportadora
        materialesSeleccionados.push({
            subitem: subitem,
            descripcion: descripcion,
            familia: familia
        });

        $('#code_material').val(subitem);
        $('#id_embalaje').val(descripcion);
        $('#familia-material').val(familia);

        $('#modal-tipo-material').modal('hide');
    });
});

// Generar QR y mostrar en modal
$(document).on('click', '.btnImprimir', function() {
    var row = $(this).closest('tr');
    var codigoProducto = row.find('td:eq(0)').text();
    var cantidad = row.find('td:eq(3)').text();
    var lote = row.find('td:eq(9)').text(); 
    var fecha = document.getElementById('fecha').value;
    var formatfecha = fecha.split('-');
    var fechaformateada = formatfecha[2] + '-' + formatfecha[1] + '-' + formatfecha[0];
    var material = materialesSeleccionados.find(mat => mat.subitem === codigoProducto);

    if (material) {
        var descripcionProducto = material.descripcion;
        var familia = material.familia;
        var proveedor = document.getElementById('nom_proveedor').value;

        var nPlanilla = $('#nPlanilla').val();
        var nGuia = $('#nGuia').val();

        var qrData = {"CodigoProducto": codigoProducto, "Cantidad": cantidad, "Lote": lote, "Fecha": fechaformateada};
        var qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(JSON.stringify(qrData))}`;

        $('#qrImage').attr('src', qrImageUrl);
        $('#modal-familia').text(familia);
        $('#modal-empresa').text(`PACKING MERQUEN SPA`);
        $('#modal-codProducto').text(`Cod.Productor: ${codigoProducto}`);
        $('#modal-descProducto').text(`${descripcionProducto}`);
        $('#modal-lote-bulto').text(`Lote/Bulto: ${nPlanilla} - ${nGuia} - ${lote}`);
        $('#modal-proveedor').text(`${proveedor}`);
        $('#modal-cantidad').text(`Cant: ${cantidad}`);
        $('#modal-fechaRec').text(`Fecha: ${fechaformateada}`);

        $('#qrModal').data('lote', lote);

        $('#qrModal').modal('show');
    }
});

// Imprime de manera unitaria la etiqueta
function imprime() {
    var familia = document.getElementById('modal-familia').innerText.trim();
    var empresa = document.getElementById('modal-empresa').innerText.trim();
    var codProducto = document.getElementById('modal-codProducto').innerText.replace('Cod.Productor: ', '').trim();
    var descProducto = document.getElementById('modal-descProducto').innerText.trim();
    var loteqr = $('#qrModal').data('lote');
    var loteBulto = document.getElementById('modal-lote-bulto').innerText.replace('Lote/Bulto: ', '').trim();
    var proveedor = document.getElementById('modal-proveedor').innerText.trim();
    var cantidad = document.getElementById('modal-cantidad').innerText.replace('Cant: ', '').trim();
    var fecha = document.getElementById('modal-fechaRec').innerText.replace('Fecha: ', '').trim();
    
    var url = `imprimir/pdf_unitario.php?lote=${encodeURIComponent(loteqr)}&familia=${encodeURIComponent(familia)}&empresa=${encodeURIComponent(empresa)}&codProducto=${encodeURIComponent(codProducto)}&descProducto=${encodeURIComponent(descProducto)}&loteBulto=${encodeURIComponent(loteBulto)}&proveedor=${encodeURIComponent(proveedor)}&cantidad=${encodeURIComponent(cantidad)}&fecha=${encodeURIComponent(fecha)}`;
    
    window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); 
}

// Imprime todas las etiquetas
$('#btnImprimirTodo').click(function() {
    var etiquetas = [];

    // Recorre todas las filas visibles en la tabla
    $('#mostrar_table tbody tr').each(function(index, rowElement) {
        var row = $(rowElement);

        // Captura los valores de la fila
        var codigoProducto = row.find('td:eq(0)').text().trim();
        var material = materialesSeleccionados.find(mat => mat.subitem === codigoProducto);

        if (material) {
            var descripcion = material.descripcion;
            var familia = material.familia;
            var cantidad = row.find('td:eq(3)').text().trim();
            var nPlanilla = $('#nPlanilla').val().trim();
            var nGuia = $('#nGuia').val().trim();
            var loteqr = row.find('td:eq(9)').text().trim();
            var loteBulto = nPlanilla + " - " + nGuia + " - " + loteqr;
            var fecha = document.getElementById('fecha').value;
            var fechaSplit = fecha.split('-');
            var fechaFormateada = fechaSplit[2] + '-' + fechaSplit[1] + '-' + fechaSplit[0];

            var proveedor = $('#nom_proveedor').val();
            var empresa = "PACKING MERQUEN SPA";

            if(codigoProducto && descripcion && loteBulto) {
                etiquetas.push({
                    familia: familia,
                    empresa: empresa,
                    codProducto: codigoProducto,
                    descProducto: descripcion,
                    loteqr: loteqr,
                    loteBulto: loteBulto,
                    proveedor: proveedor,
                    cantidad: cantidad,
                    fecha: fechaFormateada
                });
            }
        }
    });

    // Abrir una nueva ventana emergente
    var popup = window.open('', 'popup', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

    // Crear un formulario dinámico edición hecha para mandarlo por POST el get no soporta tantos caracteres
    let formularioPost = $('<form>', {
        'method': 'POST',
        'action': 'imprimir/pdf_itera_etiqueta.php',
        'target': 'popup' 
    }).append($('<input>', {
        'type': 'hidden',
        'name': 'etiquetas',
        'value': JSON.stringify(etiquetas)
    }));

    // Agregar el formulario al body de la página principal y enviarlo
    $('body').append(formularioPost);
    formularioPost.submit().remove();
});
