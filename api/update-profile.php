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

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$username = trim($data["username"] ?? "");
$email = trim($data["email"] ?? "");
$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$address = trim($data["address"] ?? "");
$newPassword = $data["password"] ?? "";

if (
    empty($username) ||
    empty($email) ||
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

$userId = $_SESSION["user"]["id"];


/* ตรวจ Username ซ้ำ */
$sql = "SELECT id FROM users
        WHERE username = ?
        AND id != ?
        LIMIT 1";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "si",
    $username,
    $userId
);

$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Username นี้ถูกใช้งานแล้ว"
    ]);

    exit;
}


$sql = "SELECT id FROM users
        WHERE email = ?
        AND id != ?
        LIMIT 1";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "si",
    $email,
    $userId
);

$stmt->execute();

if ($stmt->get_result()->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Email นี้ถูกใช้งานแล้ว"
    ]);

    exit;
}


if (!empty($newPassword)) {

    $hashedPassword = password_hash(
        $newPassword,
        PASSWORD_DEFAULT
    );

    $sql = "UPDATE users SET
                username = ?,
                email = ?,
                name = ?,
                phone = ?,
                address = ?,
                password = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "ssssssi",
        $username,
        $email,
        $name,
        $phone,
        $address,
        $hashedPassword,
        $userId
    );

} else {

    $sql = "UPDATE users SET
                username = ?,
                email = ?,
                name = ?,
                phone = ?,
                address = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssssi",
        $username,
        $email,
        $name,
        $phone,
        $address,
        $userId
    );
}


if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถแก้ไขข้อมูลได้"
    ]);

    exit;
}


$_SESSION["user"] = [
    "id" => $userId,
    "username" => $username,
    "email" => $email,
    "name" => $name,
    "phone" => $phone,
    "address" => $address
];


echo json_encode([
    "success" => true,
    "message" => "แก้ไขข้อมูลสำเร็จ",
    "user" => $_SESSION["user"]
]);

?>