<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


if (!isset($_SESSION["user"])) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณาเข้าสู่ระบบก่อน"
    ]);

    exit;
}


$userId =
    $_SESSION["user"]["id"];


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
// Order
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
        "message" => "ไม่พบคำสั่งซื้อ"
    ]);

    exit;
}


$order =
    $result->fetch_assoc();


// ==============================
// Order Items
// ==============================

$sql = "
    SELECT
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name,
        p.image
    FROM order_items oi
    LEFT JOIN products p
        ON p.id = oi.product_id
    WHERE oi.order_id = ?
";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" =>
            "เตรียม SQL สินค้าไม่สำเร็จ: " .
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


$products = [];


while ($row = $result->fetch_assoc()) {

    $products[] = $row;

}


// ==============================
// ส่งข้อมูล
// ==============================

echo json_encode([

    "success" => true,

    "order" => $order,

    "products" => $products

]);

?>