<?php

session_start();
error_log("SESSION ID LOGIN: " . session_id());
header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";


if (empty($email) || empty($password)) {

    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอก Email และ Password"
    ]);

    exit;
}


$sql = "SELECT
            id,
            username,
            email,
            password,
            name,
            phone
        FROM users
        WHERE email = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "s",
    $email
);

$stmt->execute();

$result = $stmt->get_result();

$user = $result->fetch_assoc();


if (!$user) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ Email นี้"
    ]);

    exit;
}


if (!password_verify($password, $user["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Password ไม่ถูกต้อง"
    ]);

    exit;
}


$_SESSION["user"] = [
    "id" => $user["id"],
    "username" => $user["username"],
    "email" => $user["email"],
    "name" => $user["name"],
    "phone" => $user["phone"]
];

error_log("SESSION USER: " . print_r($_SESSION["user"], true));


echo json_encode([
    "success" => true,
    "message" => "เข้าสู่ระบบสำเร็จ",
    "user" => $_SESSION["user"]
]);

?>