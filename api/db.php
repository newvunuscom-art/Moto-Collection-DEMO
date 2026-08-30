<?php


$host = "localhost";
$user = "root";
$password = "";
$database  = "moto-collection";

// $host = "sql107.infinityfree.com";
// $user = "if0_42617467";
// $password = "T0VEhX32if7V4";
// $database = "if0_42617467_moyou56";

$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

if ($conn->connect_error) {
    die("Database connection failed");
}

$conn->set_charset("utf8mb4");

?>