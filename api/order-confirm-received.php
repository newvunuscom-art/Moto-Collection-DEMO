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
// ตรวจสอบ Order
// ==============================

$sql = "
    SELECT status
    FROM orders
    WHERE order_id = ?
    AND user_id = ?
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
    "si",
    $orderId,
    $userId
);


$stmt->execute();


$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบคำสั่งซื้อของคุณ"
    ]);

    exit;
}


$order =
    $result->fetch_assoc();


// ==============================
// ต้องเป็น waiting_confirmation
// ==============================

if (
    $order["status"] !==
    "waiting_confirmation"
) {

    echo json_encode([
        "success" => false,
        "message" =>
            "คำสั่งซื้อนี้ยังไม่สามารถยืนยันรับสินค้าได้"
    ]);

    exit;
}


// ==============================
// เปลี่ยนเป็น completed
// ==============================

$sql = "
    UPDATE orders
    SET status = 'completed'
    WHERE order_id = ?
    AND user_id = ?
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
    "si",
    $orderId,
    $userId
);


if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "ยืนยันรับสินค้าไม่สำเร็จ"
    ]);

    exit;
}


echo json_encode([

    "success" => true,

    "message" =>
        "ยืนยันรับสินค้าเรียบร้อยแล้ว",

    "orderId" =>
        $orderId,

    "status" =>
        "completed"

]);

?>