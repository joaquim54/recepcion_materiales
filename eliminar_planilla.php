<?php
session_start();
include 'con_sql.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eliminar Planilla</title>
    <!-- CSS -->
    <link rel="stylesheet" href="css/style_eliminar_planilla.css">
    <!--Bootstrap 5 -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.3/css/dataTables.bootstrap5.min.css">
    <!-- CSS de Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- CDN de FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- jQuery -->
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- JS de DataTables con integración Bootstrap 5 -->
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.3/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.3/js/dataTables.bootstrap5.min.js"></script>
    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-12 text-center">
                <h3>Eliminar Planilla</h3>
            </div>
            <div class="col-12">
                <table id="resultados" class="table table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th>Planilla</th>
                            <th>Guía</th>
                            <th>Movimiento</th>
                            <th>Código Cliente</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $sql = "SELECT PLANILLA_REC, NRO_GUIA, COD_MOV, isnull(CODIGOCLIENTE,0) as CODIGOCLIENTE FROM erpfrusys.dbo.TIT_RECEPCIONMATERIALES WHERE COD_TEM = 8;";
                        $result = odbc_exec($conn, $sql);

                        while ($row = odbc_fetch_array($result)) {
                            echo "<tr>";
                            echo "<td>" . $row['PLANILLA_REC'] . "</td>";
                            echo "<td>" . $row['NRO_GUIA'] . "</td>";
                            echo "<td>" . $row['COD_MOV'] . "</td>";
                            echo "<td>" . $row['CODIGOCLIENTE'] . "</td>";
                            echo "<td><button type='button' class='btn btn-danger eliminar-planilla' data-planilla='" . $row['PLANILLA_REC'] . "'><i class='fas fa-trash-alt'></i> Eliminar</button></td>";
                            echo "</tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
<script src="js/eliminar_planilla.js"></script>
</body>

</html>