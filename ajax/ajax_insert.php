<?php
session_start();
include '../con_sql.php';


//entregar los valores para hacer el primer insert mediante ajax 
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

//insertar en la tabla de cuerpo de SDT

$sql ="";

?>