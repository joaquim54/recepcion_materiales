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

            $('#code_material').val(subitem);
            $('#id_embalaje').val(descripcion);

            $('#modal-tipo-material').modal('hide');
        });
    });


    // Generar QR y mostrar en modal
    $(document).on('click', '.btnImprimir', function() {
        var row = $(this).closest('tr');
        var codigoProducto = row.find('td:eq(0)').text();
        var cantidad = row.find('td:eq(3)').text();
        var lote = row.find('td:eq(9)').text(); 
        var fecha = row.find('td:eq(8)').text();
        var familia = $('#table-materiales').find('tr').filter(function() {
            return $(this).find('td:eq(0)').text() === codigoProducto;
        }).first().find('td:eq(4)').text(); 
        var descripcionProducto = $('#table-materiales').find('tr').filter(function() {
            return $(this).find('td:eq(0)').text() === codigoProducto;
        }).first().find('td:eq(1)').text();
        var proveedor = document.getElementById('nom_proveedor').value;

        var nPlanilla = $('#nPlanilla').val();
        var nGuia = $('#nGuia').val();

        var qrData = {"CodigoProducto": codigoProducto, "Cantidad": cantidad, "Lote": lote, "Fecha": fecha};
        var qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(JSON.stringify(qrData))}`;

        $('#qrImage').attr('src', qrImageUrl);
        $('#modal-familia').text(familia); 
        $('#modal-empresa').text(`PACKING MERQUEN SPA`);
        $('#modal-codProducto').text(`Cod.Productor: ${codigoProducto}`);
        $('#modal-descProducto').text(`${descripcionProducto}`);
        $('#modal-lote-bulto').text(`Lote/Bulto: ${nPlanilla} - ${nGuia} - ${lote}`);
        $('#modal-proveedor').text(`${proveedor}`);
        $('#modal-cantidad').text(`Cant: ${cantidad}`);
        $('#modal-fechaRec').text(`Fecha: ${fecha}`);

        $('#qrModal').modal('show');
    });

//esta función imprime de manera unitaria, la etiqueta
    function imprime() {
        var qrImageUrl = $('#qrImage').attr('src');  
        var familia = document.getElementById('modal-familia').innerText.trim();
        var empresa = document.getElementById('modal-empresa').innerText.trim();
        var codProducto = document.getElementById('modal-codProducto').innerText.replace('Cod.Productor: ', '').trim();
        var descProducto = document.getElementById('modal-descProducto').innerText.trim();
        var loteBulto = document.getElementById('modal-lote-bulto').innerText.replace('Lote/Bulto: ', '').trim();
        var proveedor = document.getElementById('modal-proveedor').innerText.trim();
        var cantidad = document.getElementById('modal-cantidad').innerText.replace('Cant: ', '').trim();
        var fechaRec = document.getElementById('modal-fechaRec').innerText.replace('Fecha: ', '').trim();
        
        var url = `imprimir/pdf_unitario.php?qrimg=${encodeURIComponent(qrImageUrl)}&familia=${encodeURIComponent(familia)}&empresa=${encodeURIComponent(empresa)}&codProducto=${encodeURIComponent(codProducto)}&descProducto=${encodeURIComponent(descProducto)}&loteBulto=${encodeURIComponent(loteBulto)}&proveedor=${encodeURIComponent(proveedor)}&cantidad=${encodeURIComponent(cantidad)}&fechaRec=${encodeURIComponent(fechaRec)}`;
        
        window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); 
    }
    

//acá imprime todas las etiquetas (para futuras modificaciones siempre modificar el array) 
    $('#btnImprimirTodo').click(function() {
        var etiquetas = [];
        
        var proveedor = $('#nom_proveedor').val();
        var fechaRec = $('#fecha').val();
        var empresa = "PACKING MERQUEN SPA";
        var familia = $('#zona').val();
    
        $('#table-materiales tbody tr').each(function(index, rowElement) {
            var row = $(rowElement);
            var codigoProducto = row.find('td:eq(0)').text();
            var descripcion = row.find('td:eq(1)').text();
            var cantidad = row.find('td:eq(2)').text();
            var loteBulto = row.find('td:eq(3)').text();
    
            if(codigoProducto && descripcion && cantidad && loteBulto) {
                etiquetas.push({
                    codigoProducto: codigoProducto,
                    descripcion: descripcion,
                    cantidad: cantidad,
                    loteBulto: loteBulto,
                    proveedor: proveedor,
                    fechaRec: fechaRec,
                    empresa: empresa,
                    familia: familia
                });
            }
        });
    
    
        if (etiquetas.length < 2) {
            alert("No hay etiquetas para imprimir");
            console.log(etiquetas);
        }

        var etiquetasJSON = encodeURIComponent(JSON.stringify(etiquetas));
        
        var url = 'imprimir/pdf_unitario.php?etiquetas=' + etiquetasJSON;
    
        window.open(url, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); 
    });
    
