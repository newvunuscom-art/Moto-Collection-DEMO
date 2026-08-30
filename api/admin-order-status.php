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


$status =
    trim($data["status"] ?? "");


if ($orderId === "") {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบเลขที่คำสั่งซื้อ"
    ]);

    exit;
}


// ==============================
// ตรวจสอบสถานะที่อนุญาต
// ==============================

$allowedStatus = [

    "shipping",
    "waiting_confirmation"

];


if (!in_array($status, $allowedStatus)) {

    echo json_encode([
        "success" => false,
        "message" => "สถานะไม่ถูกต้อง"
    ]);

    exit;
}


// ==============================
// ตรวจสอบสถานะเดิม
// ==============================

$sql = "
    SELECT status
    FROM orders
    WHERE order_id = ?
    LIMIT 1
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


$stmt->execute();


$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบคำสั่งซื้อ"
    ]);

    exit;
}


$order =
    $result->fetch_assoc();


$currentStatus =
    $order["status"];


// ==============================
// ตรวจสอบ Flow
// ==============================

if (
    $status === "shipping" &&
    $currentStatus !== "confirmed"
) {

    echo json_encode([
        "success" => false,
        "message" =>
            "คำสั่งซื้อนี้ยังไม่พร้อมจัดส่ง"
    ]);

    exit;
}


if (
    $status === "waiting_confirmation" &&
    $currentStatus !== "shipping"
) {

    echo json_encode([
        "success" => false,
        "message" =>
            "คำสั่งซื้อนี้ยังไม่ได้อยู่ระหว่างจัดส่ง"
    ]);

    exit;
}


// ==============================
// Update
// ==============================

$sql = "
    UPDATE orders
    SET status = ?
    WHERE order_id = ?
";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" =>
            "เตรียม SQL Update ไม่สำเร็จ: " .
            $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "ss",
    $status,
    $orderId
);


if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "เปลี่ยนสถานะไม่สำเร็จ: " .
            $stmt->error
    ]);

    exit;
}


// ==============================
// สำเร็จ
// ==============================

echo json_encode([

    "success" => true,

    "message" =>
        "เปลี่ยนสถานะสำเร็จ",

    "orderId" =>
        $orderId,

    "status" =>
        $status

]);

?>