function habilitarAgregarMateriales() {
    const camposCompletos = document.getElementById('nPlanilla').value.trim() !== "" &&
        document.getElementById('zona').value.trim() !== "" &&
        document.getElementById('tipo').value.trim() !== "" &&
        document.getElementById('fecha').value.trim() !== "" &&
        document.getElementById('bodegaDestino').value.trim() !== "" &&
        document.getElementById('proveedor').value.trim() !== "" &&
        document.getElementById('nGuia').value.trim() !== "" &&
        document.getElementById('code_material').value.trim() !== "" &&
        document.getElementById('id_embalaje').value.trim() !== "" &&
        document.getElementById('fechaVencimiento').value.trim() !== "" &&
        document.getElementById('rusulto_cant_bult').value.trim() !== "" &&
        document.getElementById('unidad_bultos').value.trim() !== "" &&
        document.getElementById('cant_rec').value.trim() !== "";

    if (camposCompletos) {
        document.getElementById('btnAgregarMaterial').removeAttribute('disabled');
    } else {
        document.getElementById('btnAgregarMaterial').setAttribute('disabled', 'disabled');
        document.getElementById('btnImprimirTodo').setAttribute('disabled', 'disabled'); // Deshabilitar Imprimir si los campos no están completos
    }
}

document.getElementById('btnAgregarMaterial').addEventListener('click', function() {
    document.getElementById('btnImprimirTodo').removeAttribute('disabled');
});

const campos = ['#nPlanilla', '#zona', '#tipo', '#fecha', '#bodegaDestino', '#proveedor', '#nGuia', '#code_material', '#id_embalaje', '#fechaVencimiento', '#rusulto_cant_bult', '#unidad_bultos', '#cant_rec'];
campos.forEach(selector => {
    document.querySelector(selector).addEventListener('input', habilitarAgregarMateriales);
});
