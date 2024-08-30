<?php
include '../con_sql.php';

// Recibir los datos enviados por la solicitud AJAX
$zona = isset($_POST['zona']) ? $_POST['zona'] : '';
$nplanilla = isset($_POST['nPlanilla']) ? $_POST['nPlanilla'] : '';
$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$bodegaOrigen = isset($_POST['bodegaOrigen']) ? $_POST['bodegaOrigen'] : '';
$bodegaDestino = isset($_POST['bodegaDestino']) ? $_POST['bodegaDestino'] : '';
$proveedor = isset($_POST['proveedor']) ? $_POST['proveedor'] : '';
$nGuia = isset($_POST['nGuia']) ? $_POST['nGuia'] : '';
$code_material = isset($_POST['code_material']) ? $_POST['code_material'] : '';
$id_embalaje = isset($_POST['id_embalaje']) ? $_POST['id_embalaje'] : '';
$codigo_bulto_material = isset($_POST['codigo_bulto_material']) ? $_POST['codigo_bulto_material'] : '';
$fechaVencimiento = isset($_POST['fechaVencimiento']) ? $_POST['fechaVencimiento'] : '';
$rusulto_cant_bult = isset($_POST['rusulto_cant_bult']) ? $_POST['rusulto_cant_bult'] : '';
$unidad_bultos = isset($_POST['unidad_bultos']) ? $_POST['unidad_bultos'] : '';
$cant_rec = isset($_POST['cant_rec']) ? $_POST['cant_rec'] : '';
$correlativo = isset($_POST['correlativo']) ? $_POST['correlativo'] : '';
$codigo_bulto_material = isset($_POST['id_bulto_material']) ? $_POST['id_bulto_material'] : '';
$responsable =  isset($_POST['responsable']) ? $_POST['responsable'] : '';
$cantidad_recibida = isset($_POST['unidad_bultos']) ? $_POST['unidad_bultos'] : '';

$unidad_bultos = intval(str_replace(',', '.', str_replace('.', '', $unidad_bultos)));
echo $unidad_bultos;


$val_log = "SELECT COUNT(*) FROM consultas.dbo.log_recepcion_materiales WHERE responsable <> '$responsable' 
            AND fecha = convert(smalldatetime, '$fecha', 120) 
            AND planilla = '$nplanilla';";
$result_val_log = odbc_exec($conn, $val_log);
$row_val_log = odbc_fetch_array($result_val_log);


// echo $val_log;

if ($row_val_log['count'] > 0) {
    $nplanilla = $nplanilla + 1;
}

// última aseguración en caso de que dos personas esten usando la web al mismo tiempo 

/*
$sql_max_planilla = "SELECT MAX(PLANILLA_REC) AS max_planilla FROM Erpfrusys.dbo.TIT_RECEPCIONMATERIALES WHERE COD_TEM = '$cod_tem'";
$result_max_planilla = odbc_exec($conn, $sql_max_planilla);
$row_max_planilla = odbc_fetch_array($result_max_planilla);
$max_planilla = $row_max_planilla['max_planilla'];

if ($nplanilla <= $max_planilla) {
    $nplanilla = $max_planilla + 1;
}

*/
// Verificar si ya existe un registro en TIT_RECEPCIONMATERIALES para la planilla específica
$sql_check_titulo = "SELECT COUNT(*) AS count FROM Erpfrusys.dbo.TIT_RECEPCIONMATERIALES WHERE PLANILLA_REC = '$nplanilla' and COD_TEM = '$cod_tem'";
$result_check_titulo = odbc_exec($conn, $sql_check_titulo);
$row_check_titulo = odbc_fetch_array($result_check_titulo);

if ($row_check_titulo['count'] == 0) {
    // Insertar en TIT_RECEPCIONMATERIALES (solo si no existe)
    $sql_titulo = "INSERT INTO Erpfrusys.dbo.TIT_RECEPCIONMATERIALES
    (COD_EMP, COD_TEM, ZON, PLANILLA_REC, COD_BOD, COD_MOV, CODIGOCLIENTE,
    FECHA_RECEPCION, NRO_GUIA, COD_BOD_ORIGEN, VALOR_FLETE) 
    VALUES 
    ('$cod_emp', '$cod_tem', '$zona', '$nplanilla', '$bodegaDestino', '$tipo', '$proveedor',
    CONVERT(smalldatetime, '$fecha', 120), '$nGuia', '$bodegaOrigen','0');";

    $result_titulo = odbc_exec($conn, $sql_titulo);
}

// Insertar en RECEPCIONMATERIALES (siempre)
$sql_cuerpo = "INSERT INTO Erpfrusys.dbo.RECEPCIONMATERIALES
(COD_EMP, COD_TEM, ZON, PLANILLA_REC, CORRELATIVO, SUBITEM, CAN_REC,
VALORCOMPRA, VALORVENTA,
FECHA_VENC, id_lote_venc, MONEDA) 
VALUES 
('$cod_emp', '$cod_tem', '$zona', '$nplanilla', '$correlativo', '$code_material', '$unidad_bultos',
'0','0', convert(smalldatetime,'$fechaVencimiento',120), '$codigo_bulto_material', '1');";

$result_cuerpo = odbc_exec($conn, $sql_cuerpo);

if (!$result_cuerpo) {
    echo "mal: " . $sql_cuerpo; // Imprimir "mal" + la consulta si falla
    exit;
}


if ($result_titulo && $result_cuerpo) {
    echo "correctamente";
} else {
    echo "mal  ";

}

if ($result_titulo) {

    $sql_log = "INSERT INTO consultas.dbo.log_recepcion_materiales
    (tipo_mov, fecha, planilla, responsable)
    VALUES
    ('$tipo', convert(smalldatetime, '$fecha', 120), '$nplanilla', '$responsable');";

    $result_log = odbc_exec($conn, $sql_log);

}
