<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";


// รับ JSON จาก JavaScript
$rawData = file_get_contents("php://input");

$data = json_decode($rawData, true);


// ถ้า JSON อ่านไม่ได้
if (!is_array($data)) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถอ่านข้อมูลที่ส่งมาได้",
        "raw" => $rawData
    ]);

    exit;
}


$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";


// ตรวจข้อมูล
if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอก Username และ Password"
    ]);

    exit;
}


// ค้นหา User
$sql = "
    SELECT
        id,
        username,
        email,
        password,
        name,
        phone,
        address,
        role
    FROM users
    WHERE username = ?
    LIMIT 1
";


$stmt = $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "เกิดข้อผิดพลาดในการเตรียม SQL: " . $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "s",
    $username
);


$stmt->execute();


$result = $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ Username นี้"
    ]);

    exit;
}


$user = $result->fetch_assoc();


// ตรวจ Password
if (!password_verify(
    $password,
    $user["password"]
)) {

    echo json_encode([
        "success" => false,
        "message" => "Password ไม่ถูกต้อง"
    ]);

    exit;
}


// ตรวจสิทธิ์ Admin
if ($user["role"] !== "admin") {

    echo json_encode([
        "success" => false,
        "message" => "บัญชีนี้ไม่มีสิทธิ์เข้า Admin"
    ]);

    exit;
}


// สร้าง Session Admin
$_SESSION["admin"] = [

    "id" =>
        $user["id"],

    "username" =>
        $user["username"],

    "email" =>
        $user["email"],

    "name" =>
        $user["name"],

    "phone" =>
        $user["phone"],

    "address" =>
        $user["address"],

    "role" =>
        $user["role"]

];


echo json_encode([

    "success" => true,

    "message" => "เข้าสู่ระบบ Admin สำเร็จ",

    "admin" => $_SESSION["admin"]

]);

?>