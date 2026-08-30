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


$userId = $_SESSION["user"]["id"];


// ==============================
// รับข้อมูล JSON
// ==============================

$data = json_decode(
    file_get_contents("php://input"),
    true
);


$products =
    $data["products"] ?? [];

$total =
    $data["total"] ?? 0;

$paymentMethod =
    $data["paymentMethod"] ?? "";


// ==============================
// ตรวจสอบข้อมูล
// ==============================

if (
    empty($products) ||
    $total <= 0 ||
    $paymentMethod === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลคำสั่งซื้อไม่ครบ"
    ]);

    exit;
}


// ==============================
// สร้าง Order ID
// ==============================

$orderId =
    "ORD-" .
    date("YmdHis") .
    "-" .
    rand(100, 999);


// ==============================
// Transaction
// ==============================

$conn->begin_transaction();


try {

    // ==========================
    // INSERT ORDERS
    // ==========================

    $sql = "
        INSERT INTO orders
        (
            user_id,
            order_id,
            total,
            payment_method
        )
        VALUES (?, ?, ?, ?)
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "เตรียม SQL orders ไม่สำเร็จ: " .
            $conn->error
        );

    }


    $stmt->bind_param(
        "isds",
        $userId,
        $orderId,
        $total,
        $paymentMethod
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "บันทึก orders ไม่สำเร็จ: " .
            $stmt->error
        );

    }


    // สำคัญ
    // ใช้ order_id แบบ VARCHAR
    // ไม่ใช้ insert_id

    $dbOrderId =
        $orderId;


    // ==========================
    // INSERT ORDER ITEMS
    // ==========================

    $itemSql = "
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES (?, ?, ?, ?)
    ";


    $itemStmt =
        $conn->prepare($itemSql);


    if (!$itemStmt) {

        throw new Exception(
            "เตรียม SQL order_items ไม่สำเร็จ: " .
            $conn->error
        );

    }


    foreach ($products as $product) {

        $productId =
            (int)($product["id"] ?? 0);

        $quantity =
            (int)($product["quantity"] ?? 0);

        $price =
            (float)($product["price"] ?? 0);


        if (
            $productId <= 0 ||
            $quantity <= 0
        ) {

            throw new Exception(
                "ข้อมูลสินค้าไม่ถูกต้อง"
            );

        }


        $itemStmt->bind_param(
            "siid",
            $dbOrderId,
            $productId,
            $quantity,
            $price
        );


        if (!$itemStmt->execute()) {

            throw new Exception(
                "บันทึกสินค้าไม่สำเร็จ: " .
                $itemStmt->error
            );

        }

    }


    // ==========================
    // สำเร็จ
    // ==========================

    $conn->commit();


    echo json_encode([
        "success" => true,
        "message" => "สร้างคำสั่งซื้อสำเร็จ",
        "orderId" => $orderId
    ]);

    exit;


} catch (Exception $e) {

    $conn->rollback();


    echo json_encode([
        "success" => false,
        "message" =>
            $e->getMessage()
    ]);

    exit;
}