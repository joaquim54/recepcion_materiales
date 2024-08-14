<?php
include 'con_sql.php';
$hoy = date("Y-m-d");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recepci&oacute;n de Materiales</title>

    <link rel="icon" type="image/png" href="img/fav.png">
    <!-- styles -->
    <link rel="stylesheet" href="css/style_bodega.css">
    <!-- CSS de Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- CSS de DataTables -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.3/css/jquery.dataTables.css">
    <!-- jQuery -->
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- DataTables -->
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.js"></script>
    <!-- CDN de FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- sweet alert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>

    <div class="container">
        <h2>Recepci&oacute;n de Materiales</h2>
        <h3>&nbsp;</h3>
        <div class="card card-body">
            <div class="flex-container">
                <div class="section">
                    <label for="zona">Zona:</label>
                    <select id="zona" name="zona" class="form-control">
                        <option value="" disabled selected>Seleccione</option>
                        <option value="C">C CENTRAL</option>
                        <option value="E">E EXTERNOS</option>
                    </select>
                </div>
                <div class="section">
                    <label for="nPlanilla">N° Planilla:</label>
                    <?php
                    //llama a la max planilla + 1, osea, la siguiente planilla a la ultima registrada 
                    $sql_planilla = "SELECT max(tr.PLANILLA_REC)+1 AS planilla_tit_rm FROM erpfrusys.dbo.TIT_RECEPCIONMATERIALES tr WHERE tr.COD_TEM = " . $cod_tem;
                    $result = odbc_exec($conn, $sql_planilla);
                    $row = odbc_fetch_array($result);
                    $planilla_tit_rm = $row['planilla_tit_rm'];
                    ?>
                    <input type="text" id="nPlanilla" name="nPlanilla" class="form-control" value="<?php echo htmlspecialchars($planilla_tit_rm); ?>" pattern="[0-9]+">
                </div>
            </div>

            <div class="flex-container">
                <div class="section">
                    <label for="tipo">Tipo:</label>
                    <select id="tipo" name="tipo" class="form-control" disabled>
                        <option value="" disabled selected>Seleccione</option>
                    </select>
                </div>
                <div class="section">
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" class="form-control" value="<?php echo $hoy; ?>">
                </div>
            </div>
            <div class="text-center d-flex justify-content-center">
                <button class="btn btn-primary mr-2" id="btnBusquedaOrden" role="button" disabled>
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                    B&uacute;squeda de planilla
                </button>
                <button type="button" id="btnLimpiar" class="btn btn-secondary">
                    <i class="fa-solid fa-eraser"></i>
                    Limpiar
                </button>
            </div>

        </div>
    </div>
<!-- Comieza la toma de data de la recepción de materiales -->

    <div class="container">
    <div class="collapse" id="mostrar">
        <div class="card card-body">
            <div class="form-row">
                <!-- Columna Origen de la Recepción -->
                <div class="col-md-6">
                    <h3>Origen de la Recepci&oacute;n</h3>
                    <div class="form-group">
                        <label for="bodegaOrigen">Bodega:</label>
                        <select id="bodegaOrigen" name="bodegaOrigen" class="form-control" disabled>
                            <option value="" selected>Elija una bodega</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div class="text-center">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-tipo-proveedor" style="margin-bottom: 10px;">
                                <i class="fa-solid fa-filter"></i> Buscar Proveedor
                            </button>
                        </div>
                        <label for="proveedor">Rut Proveedor:</label>
                        <input type="text" id="proveedor" name="proveedor" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label for="proveedor">Nombre proveedor:</label>
                        <input type="text" id="nom_proveedor" name="nom_proveedor" class="form-control" readonly>
                    </div>
                </div>

                <!-- Columna Destino de la Recepción -->
                <div class="col-md-6">
                    <h3>Destino de la Recepci&oacute;n</h3>
                    <div class="form-group">
                        <label for="bodegaDestino">Bodega:</label>
                        <select id="bodegaDestino" name="bodegaDestino" class="form-control">
                            <option value="" disabled selected>Elija una bodega</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="nGuia">N° Gu&iacute;a:</label>
                        <input type="text" id="nGuia" name="nGuia" class="form-control" required>
                    </div>
                </div>
            </div>

            <!-- Fila Ingreso de materiales -->
            <div class="form-row mt-4">
                <div class="col-md-6">
                    <h3>Ingreso de materiales</h3>
                    <div class="form-group">
                        <label for="code_material">C&oacute;digo:</label>
                        <div class="text-center">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-tipo-material" style="margin-bottom: 10px;">
                                <i class="fa-solid fa-filter"></i> Buscar material
                            </button>
                        </div>
                        <input type="text" id="code_material" name="code_material" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <label for="id_material">Descripción:</label>
                        <input type="text" id="id_embalaje" name="id_embalaje" class="form-control" readonly>
                    </div>
                </div>
                <div class="col-md-6 text-center">
                    <!-- Aquí puedes insertar el QR code o cualquier otro contenido que desees -->
                </div>
            </div>

            <!-- Fila Fecha vencimiento, Cantidad, etc. -->
            <div class="form-row mt-4">
                <div class="col-md-2">
                    <label for="fechaVencimiento">Fecha vencimiento:</label>
                    <input type="date" id="fechaVencimiento" name="fechaVencimiento" class="form-control" value="<?php echo $hoy; ?>">
                </div>
                <div class="col-md-2">
                    <label for="rusulto_cant_bult">Cant. Bultos:</label>
                    <input type="text" id="rusulto_cant_bult" name="rusulto_cant_bult" class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="unidad_bultos">Unid. x Bultos:</label>
                    <input type="text" id="unidad_bultos" name="unidad_bultos" class="form-control">
                </div>
                <div class="col-md-2">
                    <label for="cant_rec">Cantidad rec.:</label>
                    <input type="text" id="cant_rec" name="cant_rec" class="form-control" readonly>
                </div>
                <div class="col-md-2">
                    <label for="codigo_bulto_material">Bulto material:</label>
                    <input type="text" id="codigo_bulto_material" name="codigo_bulto_material" class="form-control" readonly>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="form-row mt-4">
                <div class="col text-center">
                    <button type="button" id="btnAgregarMaterial" name="btnAgregarMaterial" class="btn btn-primary mr-2" role="button" aria-expanded="false" aria-controls="mostrar_table" disabled>
                        <i class="fa-solid fa-plus"></i> Agregar materiales
                    </button>
                    <button type="button" id="btnImprimirTodo" name="btnImprimirTodo" class="btn btn-secondary" role="button" aria-expanded="false" disabled>
                        <i class="fa-solid fa-print"></i> Imprimir todo
                    </button>
                </div>
            </div>
            <!-- termina la toma de data del ingreso de materiales -->
        </div>
    </div>
</div>


<!-- Tabla de materiales ingresados, solo cabeceras valores se crear en base al objeto del Js-->
    <div class="container">
        <div class="collapse" id="mostrar_table">
            <div class="card card-body">
                <div class="form-row">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">C&oacute;digo</th>
                                <th scope="col">Descripci&oacute;n</th>
                                <th scope="col">Unidad</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Valor compra</th>
                                <th scope="col">Total</th>
                                <th scope="col">Correlativo</th>
                                <th scope="col">Id orden</th>
                                <th scope="col">Fecha venc</th>
                                <th scope="col">Id bulto</th>
                                <th scope="col">Imprimir</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3"></div>


<!-- Modal tipo de proveedores -->
<div class="modal fade" id="modal-tipo-proveedor" tabindex="-1" role="dialog" aria-labelledby="modal-tipo-proveedor-label" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <div class="text-center">
                    <h5 class="modal-title" id="modal-tipo-proveedor-label">Proveedores</h5>
                </div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <?php
                $sql = "SELECT CodigoCliente, NombreCliente FROM erpfrusys.dbo.PROVEEDORES where COD_TEM =" . $cod_tem . " and COD_EMP = 'MER';";
                $result = odbc_exec($conn, $sql);
                ?>
                <div class="table-responsive">
                    <table id="table-proveedores" class="table table-striped display">
                        <thead>
                            <tr>
                                <th scope="col">C&oacute;digo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            while ($row = odbc_fetch_array($result)) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($row['CodigoCliente']) . "</td>";
                                echo "<td>" . htmlspecialchars(utf8_encode($row['NombreCliente'])) . "</td>";
                                echo "<td><button type='button' class='btn btn-primary seleccionar-proveedor' data-codigo='" . htmlspecialchars($row['CodigoCliente']) . "' data-nombre='" . htmlspecialchars($row['NombreCliente']) . "'><i class='fa-solid fa-check'></i> Seleccionar</button></td>";
                                echo "</tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <i class="fa-solid fa-circle-xmark"></i> Cerrar
                </button>
            </div>
        </div>
    </div>
</div>
<script>
        $(document).ready(function() {
            $('#table-proveedor').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "lib/DataTables/es_es.json"
                }
            });
        });
    </script>

    <!-- modal tipo de materiales -->
    <div class="modal fade" id="modal-tipo-material" tabindex="-1" role="dialog" aria-labelledby="modal-tipo-material-label" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="text-center">
                        <h5 class="modal-title" id="modal-tipo-material-label">Tipo de materiales</h5>
                    </div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <?php
                    $sql = "SELECT s.SUBITEM, s.DES_SITEM, s.COD_UNID, '1,000000' AS valor, a.DESCRIPCION as 'familia' FROM Erpfrusys.dbo.SUBITEM s LEFT JOIN Erpfrusys.dbo.AGRUPACION a ON s.COD_AGRUP = a.COD_AGRUP where s.COD_TEM = " . $cod_tem;
                    $result = odbc_exec($conn, $sql);
                    ?>
                    <div class="table-responsive">
                    <table id="table-materiales" class="table table-striped display">
                        <thead>
                            <tr>
                                <th scope="col">C&oacute;digo</th>
                                <th scope="col">Descripci&oacute;n</th>
                                <th scope="col">Unidad</th>
                                <th scope="col">Valor</th>
                                <th scope="col">Familia</th>
                                <th scope="col">Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            while ($row = odbc_fetch_array($result)) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($row['SUBITEM']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['DES_SITEM']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['COD_UNID']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['valor']) . "</td>";
                                echo "<td>" . htmlspecialchars($row['familia']) . "</td>";
                                echo "<td><button type='button' class='btn btn-primary seleccionar-material' data-subitem='" . htmlspecialchars($row['SUBITEM']) . "' data-descripcion='" . htmlspecialchars($row['DES_SITEM']) . "' data-familia='" . htmlspecialchars($row['familia']) . "'><i class='fa-solid fa-check'></i> Seleccionar</button></td>";
                            }
                            echo "</tr>";
                            ?>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        <i class="fa-solid fa-circle-xmark"></i>
                        Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function() {
            $('#table-materiales').DataTable({
                "paging": true,
                "searching": true,
                "language": {
                    "url": "lib/DataTables/es_es.json"
                }
            });
        });
    </script>
    <!-- Modal para mostrar el QR -->
    <div class="modal fade" id="qrModal" name="qrModal" tabindex="-1" role="dialog" aria-labelledby="qrModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="qrModalLabel">Código QR</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="printableArea" class="modal-body text-center">
            <div class="modal-body text-center" id="printableArea">
                <img id="qrImage" src="" alt="Código QR" width="100" height="100" />
                <p id="modal-familia"></p>
                <p id="modal-empresa"></p>
                <p id="modal-codProducto"></p>
                <p id="modal-descProducto"></p>
                <p id="modal-lote-bulto"></p>
                <p id="modal-proveedor"></p>
                <p id="modal-cantidad"></p>
                <p id="modal-fechaRec"></p>
            </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnImprimirmodaluno" onclick="imprime()">Imprimir</button>
            </div>
        </div>
    </div>
</div>

    <!-- Modal para mostrar todos las etiquetas -->


    <!-- jQuery y Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script src="js/manejadores_eventos.js"></script>
    <script src="js/busqueda_ordenes.js"></script>
    <script src="js/insercion_materiales.js"></script>
    <script src="js/habilitar_boton_guardar.js"></script>
    <script src="js/generar_codigos.js"></script>
    <script src="js/limpieza_formulario.js"></script>
    <script src="js/modales_y_qr.js"></script>


</body>

</html>