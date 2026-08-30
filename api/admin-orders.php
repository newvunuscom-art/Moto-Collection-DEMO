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
        "message" => "ไม่มีสิทธิ์ Admin",
        "orders" => []
    ]);

    exit;
}


// ==============================
// ดึง Order ทั้งหมด
// ==============================

$sql = "
    SELECT
        id,
        user_id,
        order_id,
        total,
        payment_method,
        payment_status,
        slip,
        status,
        created_at
    FROM orders
    ORDER BY id DESC
";


$result =
    $conn->query($sql);


// ==============================
// ตรวจสอบ SQL
// ==============================

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" =>
            "SQL Error: " .
            $conn->error,
        "orders" => []
    ]);

    exit;
}


// ==============================
// เก็บข้อมูล
// ==============================

$orders = [];


while (
    $row =
        $result->fetch_assoc()
) {

    $orders[] = $row;

}


// ==============================
// ส่ง JSON
// ==============================

echo json_encode([

    "success" => true,

    "orders" => $orders

]);

?>