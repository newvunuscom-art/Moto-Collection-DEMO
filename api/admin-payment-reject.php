<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


// ==============================
// ตรวจสอบ Admin
// ==============================

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


// ==============================
// รับข้อมูล
// ==============================

$data = json_decode(
    file_get_contents("php://input"),
    true
);


$orderId =
    trim($data["orderId"] ?? "");


if ($orderId === "") {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบเลขที่คำสั่งซื้อ"
    ]);

    exit;
}


// ==============================
// ปฏิเสธการชำระเงิน
// ==============================

$sql = "
    UPDATE orders
    SET
        payment_status = 'rejected',
        status = 'pending'
    WHERE order_id = ?
    AND payment_status = 'waiting'
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
    "s",
    $orderId
);


// ==============================
// Execute
// ==============================

if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "ปฏิเสธการชำระเงินไม่สำเร็จ: " .
            $stmt->error
    ]);

    exit;
}


// ==============================
// ตรวจว่ามี Order ถูกแก้จริงไหม
// ==============================

if ($stmt->affected_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" =>
            "ไม่พบคำสั่งซื้อที่อยู่ในสถานะรอตรวจสอบ"
    ]);

    exit;
}


// ==============================
// สำเร็จ
// ==============================

echo json_encode([

    "success" => true,

    "message" =>
        "ปฏิเสธการชำระเงินแล้ว",

    "orderId" =>
        $orderId

]);

?>