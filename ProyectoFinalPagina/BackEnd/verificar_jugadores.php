<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$db   = 'draftosaurio';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$jugadores = $data["jugadores"] ?? [];

$invalid = [];
$stmt = $conn->prepare("SELECT Id_usuario FROM usuario WHERE Nombre_jugador = ?");
foreach ($jugadores as $nombre) {
    $nombre = trim($nombre);
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $invalid[] = $nombre;
    }
}
$stmt->close();
$conn->close();

if (empty($invalid)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "invalid" => $invalid]);
}

