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


// ==============================
// ตรวจสอบข้อมูล
// ==============================

$orderId = trim($_POST["orderId"] ?? "");

if ($orderId === "") {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบเลขที่คำสั่งซื้อ"
    ]);

    exit;
}


if (!isset($_FILES["slip"])) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณาเลือกสลิป"
    ]);

    exit;
}


$file = $_FILES["slip"];


// ==============================
// ตรวจสอบ Upload Error
// ==============================

if ($file["error"] !== UPLOAD_ERR_OK) {

    echo json_encode([
        "success" => false,
        "message" => "อัปโหลดไฟล์ไม่สำเร็จ"
    ]);

    exit;
}


// ==============================
// ตรวจสอบขนาดไฟล์
// ==============================

$maxSize = 5 * 1024 * 1024;

if ($file["size"] > $maxSize) {

    echo json_encode([
        "success" => false,
        "message" => "ไฟล์ต้องมีขนาดไม่เกิน 5 MB"
    ]);

    exit;
}


// ==============================
// ตรวจสอบประเภทไฟล์
// ==============================

$finfo = finfo_open(FILEINFO_MIME_TYPE);

$mimeType = finfo_file(
    $finfo,
    $file["tmp_name"]
);

finfo_close($finfo);


$allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


if (!in_array($mimeType, $allowedTypes)) {

    echo json_encode([
        "success" => false,
        "message" => "รองรับเฉพาะ JPG, PNG และ WEBP"
    ]);

    exit;
}


// ==============================
// User ID
// ==============================

$userId = $_SESSION["user"]["id"];


// ==============================
// ตรวจสอบ Order
// ==============================

$sql = "
    SELECT id
    FROM orders
    WHERE order_id = ?
    AND user_id = ?
    LIMIT 1
";

$stmt = $conn->prepare($sql);


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

$result = $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบคำสั่งซื้อของคุณ"
    ]);

    exit;
}


$stmt->close();


// ==============================
// สร้างโฟลเดอร์
// ==============================

$uploadDir = "../image/slips/";

if (!is_dir($uploadDir)) {

    if (!mkdir($uploadDir, 0777, true)) {

        echo json_encode([
            "success" => false,
            "message" => "ไม่สามารถสร้างโฟลเดอร์เก็บสลิปได้"
        ]);

        exit;
    }
}


// ==============================
// กำหนดนามสกุลไฟล์
// ==============================

$extension = match ($mimeType) {

    "image/jpeg" => "jpg",
    "image/png"  => "png",
    "image/webp" => "webp",

    default => "jpg"
};


// ==============================
// สร้างชื่อไฟล์
// ==============================

$fileName =
    $orderId .
    "_" .
    time() .
    "." .
    $extension;


$filePath =
    $uploadDir .
    $fileName;


// ==============================
// ย้ายไฟล์
// ==============================

if (!move_uploaded_file(
    $file["tmp_name"],
    $filePath
)) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถบันทึกสลิปได้"
    ]);

    exit;
}


// ==============================
// Path ที่เก็บใน Database
// ==============================

$slipPath =
    "image/slips/" .
    $fileName;


// ==============================
// UPDATE Order
// ==============================

$sql = "
    UPDATE orders
    SET
        slip = ?,
        payment_status = 'waiting'
    WHERE order_id = ?
    AND user_id = ?
";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    // ถ้า SQL ผิด ให้ลบไฟล์ที่เพิ่งอัปโหลด
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    echo json_encode([
        "success" => false,
        "message" =>
            "เตรียม SQL อัปเดตไม่สำเร็จ: " .
            $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "ssi",
    $slipPath,
    $orderId,
    $userId
);


if (!$stmt->execute()) {

    if (file_exists($filePath)) {
        unlink($filePath);
    }

    echo json_encode([
        "success" => false,
        "message" =>
            "บันทึกข้อมูลการชำระเงินไม่สำเร็จ: " .
            $stmt->error
    ]);

    exit;
}


$stmt->close();


// ==============================
// สำเร็จ
// ==============================

echo json_encode([

    "success" => true,

    "message" =>
        "อัปโหลดสลิปสำเร็จ",

    "orderId" =>
        $orderId,

    "slip" =>
        $slipPath

]);

?>