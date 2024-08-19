<?php
require('../lib/fpdf/fpdf.php');
include('../lib/phpqrcode/phpqrcode/qrlib.php'); 

class PDF_Label extends FPDF
{
    function __construct($orientation = 'P', $unit = 'mm', $format = array(100, 100))
    {
        parent::__construct($orientation, $unit, $format);
    }

    function AddLabel($qrPath, $familia, $empresa, $codProducto, $descripcion, $loteBulto, $proveedor, $cantidad, $fechaRec)
    {
        $this->AddPage();

        // QR Code
        $this->Image($qrPath, 35, 5, 30, 30, 'PNG');  
        // Familia
        $this->SetFont('Arial', 'B', 10);
        $this->SetXY(10, 33);
        $this->Cell(80, 5, $familia, 0, 1, 'C');

        // Empresa
        $this->SetFont('Arial', 'B', 10);
        $this->SetXY(10, 38);
        $this->Cell(80, 5, $empresa, 0, 1, 'C');

        // Código del Producto
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 43);
        $this->Cell(80, 5, "Cod. Producto: " . $codProducto, 0, 1, 'C');

        // Descripción
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 48);
        $this->MultiCell(80, 5, $descripcion, 0, 'C');

        // Lote/Bulto
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 57);
        $this->Cell(80, 5, " " . $loteBulto, 0, 1, 'C');

        // Proveedor
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 62);
        $this->Cell(80, 5, $proveedor, 0, 1, 'C');

        // Cantidad
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 67);
        $this->Cell(80, 5, "Cant:" . $cantidad, 0, 1, 'C');

        // Fecha de Recepción
        $this->SetFont('Arial', '', 10);
        $this->SetXY(10, 72);  
        $this->Cell(80, 5, "" . $fechaRec, 0, 1, 'C');
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    $familia = $_GET['familia'];
    $empresa = $_GET['empresa'];
    $codProducto = $_GET['codProducto'];
    $descripcion = $_GET['descProducto'];
    $lote = $_GET['lote'];
    $loteBulto = $_GET['loteBulto'];
    $lote = $_GET['lote'];
    $proveedor = $_GET['proveedor'];
    $cantidad = $_GET['cantidad'];
    $fechaRec = $_GET['fechaRec'];

    // Generar QR localmente
    $qrData = json_encode(array(
        "CodigoProducto" => $codProducto,
        "Cantidad" => $cantidad,
        "Lote" => $lote,
        "Fecha" => $fechaRec
    ));

    $qrPath = sys_get_temp_dir() . '/qr_' . md5($codProducto . $loteqr) . '.png';
    QRcode::png($qrData, $qrPath, QR_ECLEVEL_L, 10);

    $pdf = new PDF_Label();
    $pdf->AddLabel($qrPath, $familia, $empresa, $codProducto, $descripcion, $loteBulto, $proveedor, $cantidad, $fechaRec);

    if (file_exists($qrPath)) {
        unlink($qrPath);
    }

    $pdf->Output('I', 'Etiqueta.pdf');
}
