<?php

require_once('../config/config.php');
class IVA
{
    //TODO: Implementar los metodos de la clase

    public function todos() //select * from iva
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `iva`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }
}