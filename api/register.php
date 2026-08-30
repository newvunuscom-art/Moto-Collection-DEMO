<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$username = $data["username"] ?? "";
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";
$name = $data["name"] ?? "";
$phone = $data["phone"] ?? "";
$address = $data["address"] ?? "";

if (
    empty($username) ||
    empty($email) ||
    empty($password) ||
    empty($name) ||
    empty($phone) ||
    empty($address)
) {
    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกข้อมูลให้ครบ"
    ]);
    exit;
}

$hashedPassword = password_hash(
    $password,
    PASSWORD_DEFAULT
);

$sql = "INSERT INTO users
        (username, email, password, name, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssss",
    $username,
    $email,
    $hashedPassword,
    $name,
    $phone,
    $address
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "สมัครสมาชิกสำเร็จ"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "สมัครสมาชิกไม่สำเร็จ: " . $stmt->error
    ]);
}