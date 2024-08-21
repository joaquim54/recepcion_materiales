document.addEventListener('DOMContentLoaded', function() {
    var nPlanilla = document.getElementById('nPlanilla');
    var btnLimpiar = document.getElementById('btnLimpiar');

    btnLimpiar.addEventListener('click', function() {
        var inputs = document.querySelectorAll('input:not(#nPlanilla), select');
        
        inputs.forEach(function(input) {
            if (input.type === 'checkbox') {
                input.checked = false; 
            } else {
                input.value = ''; 
            }
        });

        $('#mostrar').collapse('hide');
        $('#mostrar_table').collapse('hide');
    });
    
    btnNuevaPlanilla.addEventListener('click', function() {
            Swal.fire({
                title: "¿Estas seguro?",
                text: "Al presionar este botón cambiará de planilla",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar"
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
        });
    });




