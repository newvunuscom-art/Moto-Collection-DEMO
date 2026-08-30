<?php 

session_start();

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["user"])) {

    echo json_encode([
        "success" => false,
        "message" => "ยังไม่ได้เข้าสู่ระบบ"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "user" => $_SESSION["user"]
]);
?>