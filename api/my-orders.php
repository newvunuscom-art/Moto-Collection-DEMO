<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


// ==============================
// ตรวจสอบ Login
// ==============================

if (!isset($_SESSION["user"])) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณาเข้าสู่ระบบก่อน"
    ]);

    exit;
}


$userId =
    $_SESSION["user"]["id"];


// ==============================
// ดึง Order ของ User
// ==============================

$sql = "
    SELECT
        id,
        order_id,
        total,
        payment_method,
        payment_status,
        status,
        slip,
        created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" =>
            "เตรียม SQL ไม่สำเร็จ: " .
            $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "i",
    $userId
);


if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "ไม่สามารถโหลดคำสั่งซื้อได้"
    ]);

    exit;
}


$result =
    $stmt->get_result();


$orders = [];


while ($row = $result->fetch_assoc()) {

    $orders[] = $row;

}


// ==============================
// ส่งข้อมูล
// ==============================

echo json_encode([

    "success" => true,

    "orders" => $orders

]);

?>