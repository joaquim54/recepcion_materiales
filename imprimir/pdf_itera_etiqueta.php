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
        $this->SetFont('Arial', '', 8);
        $this->SetXY(10, 43);
        $this->Cell(80, 5, "Cod. Producto: " . $codProducto, 0, 1, 'C');

        // Descripción
        $this->SetFont('Arial', '', 7);
        $this->SetXY(10, 48);
        $this->MultiCell(80, 4, $descripcion, 0, 'C');

        // Lote/Bulto
        $this->SetFont('Arial', '', 8);
        $this->SetXY(10, 57);
        $this->Cell(80, 5, " " . $loteBulto, 0, 1, 'C');

        // Proveedor
        $this->SetFont('Arial', '', 8);
        $this->SetXY(10, 62);
        $this->Cell(80, 5, $proveedor, 0, 1, 'C');

        // Cantidad
        $this->SetFont('Arial', '', 8);
        $this->SetXY(10, 67);
        $this->Cell(80, 5, "" . $cantidad, 0, 1, 'C');

        // Fecha de Recepción
        $this->SetFont('Arial', '', 8);
        $this->SetXY(10, 72);  
        $this->Cell(80, 5, "" . $fechaRec, 0, 1, 'C');
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $etiquetas = json_decode($_GET['etiquetas'], true);

    if (empty($etiquetas)) {
        die('No se recibieron etiquetas.');
    }

    $pdf = new PDF_Label();

    foreach ($etiquetas as $etiqueta) {
        $qrData = json_encode(array(
            "CodigoProducto" => $etiqueta['codigoProducto'],
            "Cantidad" => $etiqueta['cantidad'],
            "Lote" => $etiqueta['loteBulto'],
            "Fecha" => $etiqueta['fechaRec']
        ));

        $qrPath = sys_get_temp_dir() . '/qr_' . md5($etiqueta['codigoProducto'] . $etiqueta['loteBulto']) . '.png';
        QRcode::png($qrData, $qrPath, QR_ECLEVEL_L, 10);

        $pdf->AddLabel(
            $qrPath,
            $etiqueta['familia'],
            $etiqueta['empresa'],
            $etiqueta['codigoProducto'],
            $etiqueta['descripcion'],
            $etiqueta['loteBulto'],
            $etiqueta['proveedor'],
            $etiqueta['cantidad'],
            $etiqueta['fechaRec']
        );

        if (file_exists($qrPath)) {
            unlink($qrPath);
        }
    }

    $pdf->Output('I', 'Etiquetas.pdf');
}

?>