<?php
// Conexión a la base de datos
include '../con_sql.php';

// Función para obtener una columna específica de un array
function array_column_custom($array, $column_key) {
    $result = array();
    foreach ($array as $sub_array) {
        if (is_array($sub_array) && isset($sub_array[$column_key])) {
            $result[] = $sub_array[$column_key];
        }
    }
    return $result;
}

if (isset($_POST['nPlanilla'])) {
    $nPlanilla = $_POST['nPlanilla'];

    $sql = "SELECT 
    r.SUBITEM AS codigo,  
    s.DES_SITEM AS descripcion,  
    s.COD_UNID, 
    r.CAN_REC,
    '1,000000' AS valor_compra,
    0 AS total, 
    r.CORRELATIVO AS correlativo, 
    0 AS id_orden, 
    r.fecha_venc AS fecha_vencimiento,
    r.id_lote_venc AS id_bulto
    FROM Erpfrusys.dbo.RECEPCIONMATERIALES r
    LEFT JOIN Erpfrusys.dbo.SUBITEM s
    ON r.SUBITEM COLLATE Modern_Spanish_CI_AS = s.SUBITEM COLLATE Modern_Spanish_CI_AS
    AND r.COD_TEM COLLATE Modern_Spanish_CI_AS = s.COD_TEM COLLATE Modern_Spanish_CI_AS
    WHERE r.COD_TEM = $cod_tem
    and r.PLANILLA_REC = '$nPlanilla'
    ORDER BY r.CORRELATIVO ASC;";

    $result = odbc_exec($conn, $sql);
    $data = array();

    if ($result) {
        while ($row = odbc_fetch_array($result)) {
            $data[] = $row;
        }

        echo json_encode(array('data' => $data));
    } else {
        echo json_encode(array('error' => 'No se encontraron resultados.'));
    }
} else {
    echo json_encode(array('error' => 'Datos incompletos.'));
}
?>
