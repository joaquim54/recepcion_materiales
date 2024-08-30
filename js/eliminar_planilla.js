
$(document).ready(function() {
    $('#resultados').DataTable(
        {
            "paging": true,
            "searching": true,
            "language": {
                "url": "lib/DataTables/es_es.json"
            }
});
    $('.eliminar-planilla').on('click', function() {
        var planilla = $(this).data('planilla');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "En caso de volver a querer estos datos, deberás volver a crear la planilla. Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: 'ajax/eliminar_planilla_ajax.php',
                    type: 'POST',
                    data: {
                        planilla: planilla
                    },
                    success: function() {
                        Swal.fire(
                            'Eliminado!',
                            'La planilla ha sido eliminada.',
                            'success'
                        ).then(() => {
                            location.reload();
                        });
                    },
                    error: function() {
                        Swal.fire(
                            'Error!',
                            'Hubo un error al eliminar la planilla.',
                            'error'
                        );
                    }
                });
            }
        });
    });
});