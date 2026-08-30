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
// เริ่ม Transaction
// ==============================

$conn->begin_transaction();


try {

    // ==========================
    // ตรวจสอบ Order
    // ==========================

    $sql = "
        SELECT id
        FROM orders
        WHERE order_id = ?
        AND payment_status = 'waiting'
        LIMIT 1
        FOR UPDATE
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "เตรียม SQL ตรวจสอบ Order ไม่สำเร็จ: " .
            $conn->error
        );

    }


    $stmt->bind_param(
        "s",
        $orderId
    );


    $stmt->execute();


    $orderResult =
        $stmt->get_result();


    if ($orderResult->num_rows === 0) {

        throw new Exception(
            "ไม่พบคำสั่งซื้อที่กำลังรอตรวจสอบ"
        );

    }


    // ==========================
    // ดึงรายการสินค้า
    // ==========================

    $sql = "
        SELECT
            product_id,
            quantity
        FROM order_items
        WHERE order_id = ?
    ";


    $itemStmt =
        $conn->prepare($sql);


    if (!$itemStmt) {

        throw new Exception(
            "เตรียม SQL รายการสินค้าไม่สำเร็จ: " .
            $conn->error
        );

    }


    $itemStmt->bind_param(
        "s",
        $orderId
    );


    $itemStmt->execute();


    $items =
        $itemStmt->get_result();


    if ($items->num_rows === 0) {

        throw new Exception(
            "ไม่พบรายการสินค้าในคำสั่งซื้อ"
        );

    }


    // ==========================
    // หัก Stock
    // ==========================

    while (
        $item =
        $items->fetch_assoc()
    ) {

        $productId =
            (int)$item["product_id"];


        $quantity =
            (int)$item["quantity"];


        if (
            $productId <= 0 ||
            $quantity <= 0
        ) {

            throw new Exception(
                "ข้อมูลสินค้าใน Order ไม่ถูกต้อง"
            );

        }


        // --------------------------
        // หัก Stock
        // --------------------------

        $stockSql = "
            UPDATE products
            SET stock = stock - ?
            WHERE id = ?
            AND stock >= ?
        ";


        $stockStmt =
            $conn->prepare($stockSql);


        if (!$stockStmt) {

            throw new Exception(
                "เตรียม SQL ตัด Stock ไม่สำเร็จ: " .
                $conn->error
            );

        }


        $stockStmt->bind_param(
            "iii",
            $quantity,
            $productId,
            $quantity
        );


        if (!$stockStmt->execute()) {

            throw new Exception(
                "ตัด Stock ไม่สำเร็จ: " .
                $stockStmt->error
            );

        }


        // affected_rows = 0
        // หมายถึง Stock ไม่พอ
        if (
            $stockStmt->affected_rows === 0
        ) {

            throw new Exception(
                "สินค้า ID " .
                $productId .
                " มี Stock ไม่เพียงพอ"
            );

        }

    }


    // ==========================
    // อนุมัติการชำระเงิน
    // ==========================

    $sql = "
        UPDATE orders
        SET
            payment_status = 'paid',
            status = 'confirmed'
        WHERE order_id = ?
        AND payment_status = 'waiting'
    ";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        throw new Exception(
            "เตรียม SQL อนุมัติ Order ไม่สำเร็จ: " .
            $conn->error
        );

    }


    $stmt->bind_param(
        "s",
        $orderId
    );


    if (!$stmt->execute()) {

        throw new Exception(
            "อนุมัติการชำระเงินไม่สำเร็จ: " .
            $stmt->error
        );

    }


    if ($stmt->affected_rows === 0) {

        throw new Exception(
            "ไม่สามารถอนุมัติคำสั่งซื้อได้"
        );

    }


    // ==========================
    // ยืนยัน Transaction
    // ==========================

    $conn->commit();


    echo json_encode([

        "success" => true,

        "message" =>
            "อนุมัติการชำระเงินและตัด Stock สำเร็จ",

        "orderId" =>
            $orderId

    ]);


} catch (Exception $e) {

    // ==========================
    // ถ้าเกิด Error
    // ย้อนกลับทั้งหมด
    // ==========================

    $conn->rollback();


    echo json_encode([

        "success" => false,

        "message" =>
            $e->getMessage()

    ]);

}

?>