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
});
