<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION["admin"])) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่ได้เข้าสู่ระบบ Admin"
    ]);

    exit;
}


if (
    !isset($_SESSION["admin"]["role"]) ||
    $_SESSION["admin"]["role"] !== "admin"
) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่มีสิทธิ์ Admin"
    ]);

    exit;
}


echo json_encode([
    "success" => true,
    "admin" => $_SESSION["admin"]
]);

exit;

?>