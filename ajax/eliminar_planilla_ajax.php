<?php
session_start();

include '../con_sql.php';

$planilla = isset($_POST['planilla']) ? $_POST['planilla'] : '';

$sql = "DELETE FROM erpfrusys.dbo.TIT_RECEPCIONMATERIALES WHERE PLANILLA_REC = '$planilla';";
$result = odbc_exec($conn, $sql);
if ($result) {
    echo 'success';
}else{
    echo 'error';
}
?>