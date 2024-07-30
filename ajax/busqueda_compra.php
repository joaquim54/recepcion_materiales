<?php
include('../con_sql.php');

if (isset($_POST['nPlanilla'])) {
    $nPlanilla = $_POST['nPlanilla'];

    $sql = "SELECT DISTINCT tr.cod_mov,
    CONCAT(tr.cod_mov, ' ', tm.DES_MOV) as des_movimiento,
    tr.cod_bod_origen AS origen,
    tr.cod_bod as destino, tr.nro_guia,
    concat(tr.cod_bod_origen, ' ', b1.NOM_BOD) AS bodega_ori,
    concat(tr.cod_bod, ' ', b1.NOM_BOD) AS bodega_destino
    FROM erpfrusys.dbo.TIT_RECEPCIONMATERIALES tr 
    JOIN erpfrusys.dbo.TIP_MOV tm ON tr.cod_mov = tm.COD_MOV
    JOIN Erpfrusys.dbo.BODEGAS b ON tr.cod_bod_origen = b.COD_BOD 
    JOIN Erpfrusys.dbo.BODEGAS b1 ON tr.COD_BOD = b1.COD_BOD
    WHERE tr.COD_TEM = '$cod_tem' AND tr.PLANILLA_REC = '$nPlanilla' ";

    $result = odbc_exec($conn, $sql);
    $data = array();

    if ($result) {
        while ($row = odbc_fetch_array($result)) {
            $data[] = $row;
        }

        
        $bodegas_origen = array();
        $bodegas_destino = array();
        if (empty($data)) {
            $sql_bodegas = "SELECT CONCAT(COD_BOD, ' ', NOM_BOD) AS bodegas 
                            FROM erpfrusys.dbo.BODEGAS 
                            WHERE COD_TEM = '$cod_tem'";
            $result_bodegas = odbc_exec($conn, $sql_bodegas);

            if ($result_bodegas) {
                while ($row = odbc_fetch_array($result_bodegas)) {
                    $bodegas_origen[] = $row['bodegas'];
                    $bodegas_destino[] = $row['bodegas'];
                }
            }

            // Obtener todos los tipos si no hay coincidencias
            $sql_tipos = "SELECT CONCAT(tm.COD_MOV, ' ', tm.DES_MOV) as des_movimiento 
                        FROM erpfrusys.dbo.TIP_MOV tm
                        WHERE tm.DES_MOV <> ''";
            $result_tipos = odbc_exec($conn, $sql_tipos);
            while ($row = odbc_fetch_array($result_tipos)) {
                $data[] = $row;
            }
        } else {
            foreach ($data as $item) {
                if (!in_array($item['bodega_ori'], $bodegas_origen)) {
                    $bodegas_origen[] = $item['bodega_ori'];
                }
                if (!in_array($item['bodega_destino'], $bodegas_destino)) {
                    $bodegas_destino[] = $item['bodega_destino'];
                }
            }
        }
        
        $sql_proveedores = "SELECT CONCAT(CodigoCliente,' ',NombreCliente) as concat_prov 
        FROM erpfrusys.dbo.PROVEEDORES 
        WHERE COD_TEM = '$cod_tem' AND COD_EMP = 'MER'";
        $result_proveedores = odbc_exec($conn, $sql_proveedores);
        if ($result_proveedores) {
            while ($row = odbc_fetch_array($result_proveedores)) {
                $proveedores[] = $row['concat_prov'];
            }
        }

        echo json_encode(array('data' => $data, 'bodegas_origen' => $bodegas_origen, 'bodegas_destino' => $bodegas_destino, 'proveedores' => $proveedores));
    } else {
        echo json_encode(array('error' => 'No se encontraron resultados.'));
    }
} else {
    echo json_encode(array('error' => 'Datos incompletos.'));
}
?>