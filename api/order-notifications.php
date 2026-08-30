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


$sql = "
    SELECT
        order_id,
        status,
        payment_status,
        total,
        created_at
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
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


$stmt->execute();


$result =
    $stmt->get_result();


$notifications = [];


while ($order = $result->fetch_assoc()) {

    $message = "";


    if (
        $order["payment_status"] === "waiting"
    ) {

        $message =
            "รอตรวจสอบการชำระเงิน";

    }

    elseif (
        $order["payment_status"] === "rejected"
    ) {

        $message =
            "การชำระเงินถูกปฏิเสธ";

    }

    elseif (
        $order["status"] === "confirmed"
    ) {

        $message =
            "ชำระเงินได้รับการยืนยันแล้ว";

    }

    elseif (
        $order["status"] === "shipping"
    ) {

        $message =
            "สินค้ากำลังจัดส่ง";

    }

    elseif (
        $order["status"] === "completed"
    ) {

        $message =
            "จัดส่งสินค้าเรียบร้อยแล้ว";

    }


    if ($message !== "") {

        $notifications[] = [

            "orderId" =>
                $order["order_id"],

            "message" =>
                $message,

            "status" =>
                $order["status"],

            "paymentStatus" =>
                $order["payment_status"],

            "createdAt" =>
                $order["created_at"]

        ];

    }

}


echo json_encode([

    "success" => true,

    "notifications" => $notifications

]);

?>