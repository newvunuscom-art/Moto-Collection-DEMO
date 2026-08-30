<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


if (
    !isset($_SESSION["admin"]) ||
    $_SESSION["admin"]["role"] !== "admin"
) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่มีสิทธิ์ Admin"
    ]);

    exit;
}


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$id = (int)($data["id"] ?? 0);


if ($id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ ID สินค้า"
    ]);

    exit;
}


$stmt = $conn->prepare(
    "DELETE FROM products WHERE id = ?"
);


$stmt->bind_param(
    "i",
    $id
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "ลบสินค้าสำเร็จ"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "ลบสินค้าไม่สำเร็จ"
    ]);

}

?>