<?php
session_start();

// Borrar todas las variables de sesión
$_SESSION = [];

// Destruir la sesión
session_destroy();

// Redirigir al inicio
header("Location: ../FrontEnd/index.php");
exit();
