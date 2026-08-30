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
// รับข้อมูลจาก FormData
// ==============================

$name =
    trim($_POST["name"] ?? "");

$price =
    $_POST["price"] ?? "";

$stock =
    $_POST["stock"] ?? "";


// ==============================
// ตรวจสอบข้อมูล
// ==============================

if (
    $name === "" ||
    $price === "" ||
    $stock === ""
) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกข้อมูลสินค้าให้ครบ"
    ]);

    exit;
}


// ==============================
// ตรวจสอบรูป
// ==============================

if (
    !isset($_FILES["image"]) ||
    $_FILES["image"]["error"] !== UPLOAD_ERR_OK
) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณาเลือกรูปสินค้า"
    ]);

    exit;
}


$image =
    $_FILES["image"];


// ==============================
// ตรวจสอบประเภทไฟล์
// ==============================

$allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
];


if (
    !in_array(
        $image["type"],
        $allowedTypes
    )
) {

    echo json_encode([
        "success" => false,
        "message" => "รองรับเฉพาะ JPG, PNG, WEBP และ GIF"
    ]);

    exit;
}


// ==============================
// ตรวจสอบขนาดไฟล์
// 5 MB
// ==============================

if (
    $image["size"] > 5 * 1024 * 1024
) {

    echo json_encode([
        "success" => false,
        "message" => "รูปภาพต้องมีขนาดไม่เกิน 5 MB"
    ]);

    exit;
}


// ==============================
// สร้างชื่อไฟล์ใหม่
// ==============================

$extension =
    strtolower(
        pathinfo(
            $image["name"],
            PATHINFO_EXTENSION
        )
    );


$fileName =
    uniqid("product_", true)
    . "."
    . $extension;


// ==============================
// โฟลเดอร์เก็บรูป
// ==============================

$imageFolder =
    __DIR__ . "/../image/";


// ถ้าไม่มีโฟลเดอร์ให้สร้าง
if (
    !is_dir($imageFolder)
) {

    mkdir(
        $imageFolder,
        0777,
        true
    );
}


// ==============================
// ตำแหน่งไฟล์
// ==============================

$imagePath =
    $imageFolder . $fileName;


// ==============================
// ย้ายไฟล์
// ==============================

if (
    !move_uploaded_file(
        $image["tmp_name"],
        $imagePath
    )
) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถบันทึกรูปภาพได้"
    ]);

    exit;
}


// ==============================
// Path ที่เก็บใน Database
// ==============================

$imageUrl =
    "image/" . $fileName;


// ==============================
// แปลงข้อมูล
// ==============================

$price =
    (float)$price;

$stock =
    (int)$stock;


// ==============================
// INSERT DATABASE
// ==============================

$sql = "
    INSERT INTO products
    (
        name,
        price,
        image,
        stock
    )
    VALUES (?, ?, ?, ?)
";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "เตรียม SQL ไม่สำเร็จ: " . $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "sdsi",
    $name,
    $price,
    $imageUrl,
    $stock
);


// ==============================
// บันทึก
// ==============================

if (
    $stmt->execute()
) {

    echo json_encode([
        "success" => true,
        "message" => "เพิ่มสินค้าสำเร็จ",
        "id" => $stmt->insert_id,
        "image" => $imageUrl
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" =>
            "เพิ่มสินค้าไม่สำเร็จ: "
            . $stmt->error
    ]);

}


$stmt->close();
$conn->close();

?>