<?
$cod_emp='MER';
$cod_tem='7';
$dsn = "Driver={SQL Server};Server=192.168.7.25;Database=bodega;Integrated Security=SSPI;Persist Security Info=False;";
$conn = odbc_connect( $dsn, 'jogarces', 'jgarces2507' );
if (!$conn)
{ 
exit( "Error al conectar: " . $conn);
}

?>
