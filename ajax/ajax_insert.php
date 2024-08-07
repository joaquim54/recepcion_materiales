<?php
session_start();
include '../con_sql_prueba.php';

// Recibir los datos enviados por la solicitud AJAX
$zona = isset($_POST['zona']) ? $_POST['zona'] : '';
$nplanilla = isset($_POST['nPlanilla']) ? $_POST['nPlanilla'] : '';
$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$bodegaOrigen = isset($_POST['bodegaOrigen']) ? $_POST['bodegaOrigen'] : '';
$bodegaDestino = isset($_POST['bodegaDestino']) ? $_POST['bodegaDestino'] : '';
$proveedor = isset($_POST['proveedor']) ? $_POST['proveedor'] : '';
$nGuia = isset($_POST['nGuia']) ? $_POST['nGuia'] : '';
$guiaObjeta = isset($_POST['guiaObjeta']) ? $_POST['guiaObjeta'] : '';
$observacion = isset($_POST['observacion']) ? $_POST['observacion'] : '';
$code_material = isset($_POST['code_material']) ? $_POST['code_material'] : '';
$id_embalaje = isset($_POST['id_embalaje']) ? $_POST['id_embalaje'] : '';
$codigo_bulto_material = isset($_POST['codigo_bulto_material']) ? $_POST['codigo_bulto_material'] : '';
$fechaVencimiento = isset($_POST['fechaVencimiento']) ? $_POST['fechaVencimiento'] : '';
$rusulto_cant_bult = isset($_POST['rusulto_cant_bult']) ? $_POST['rusulto_cant_bult'] : '';
$unidad_bultos = isset($_POST['unidad_bultos']) ? $_POST['unidad_bultos'] : '';
$cant_rec = isset($_POST['cant_rec']) ? $_POST['cant_rec'] : '';
$correlativo = isset($_POST['correlativo']) ? $_POST['correlativo'] : '';
$codigo_bulto_material = isset($_POST['id_bulto_material']) ? $_POST['id_bulto_material'] : '';


// Verificar si ya existe un registro en TIT_RECEPCIONMATERIALES para la planilla específica
$sql_check_titulo = "SELECT COUNT(*) AS count FROM Bodega.dbo.TIT_RECEPCIONMATERIALES WHERE PLANILLA_REC = '$nplanilla'";
$result_check_titulo = odbc_exec($conn, $sql_check_titulo);
$row_check_titulo = odbc_fetch_array($result_check_titulo);

if ($row_check_titulo['count'] == 0) {
    // Insertar en TIT_RECEPCIONMATERIALES (solo si no existe)
    $sql_titulo = "INSERT INTO Bodega.dbo.TIT_RECEPCIONMATERIALES
    (COD_EMP, COD_TEM, ZON, PLANILLA_REC, COD_BOD, COD_MOV, CODIGOCLIENTE,
    FECHA_RECEPCION, NRO_GUIA, COD_BOD_ORIGEN, GUIA_OBJETADA, OBSERVACION) 
    VALUES 
    ('$cod_emp', '$cod_tem', '$zona', '$nplanilla', '$bodegaDestino', '$tipo', '$proveedor',
    CONVERT(smalldatetime, '$fecha', 120), '$nGuia', '$bodegaOrigen', '$guiaObjeta', '$observacion');";

    $result_titulo = odbc_exec($conn, $sql_titulo);

    if (!$result_titulo) {
        echo "Error al insertar el registro del título: " . odbc_errormsg($conn);
        exit;
    }
}

// Insertar en RECEPCIONMATERIALES (siempre)
$sql_cuerpo = "INSERT INTO Bodega.dbo.RECEPCIONMATERIALES
(COD_EMP, COD_TEM, ZON, PLANILLA_REC, CORRELATIVO, SUBITEM, CAN_REC,
ID_ORDEN, FECHA_VENC, id_lote_venc) 
VALUES 
('$cod_emp', '$cod_tem', '$zona', '$nplanilla', '$correlativo', '$code_material', '$cant_rec',
'', '$fechaVencimiento', '$codigo_bulto_material');";

echo $sql_cuerpo;

$result_cuerpo = odbc_exec($conn, $sql_cuerpo);

if ($result_cuerpo) {
    echo "El registro se ha insertado correctamente";
} else {
    echo "Error al insertar el registro del cuerpo: " . odbc_errormsg($conn);
}
?>
