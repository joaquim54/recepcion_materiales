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

    
/* function toggleBusquedaButton() {
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
    }
    );*/
});
