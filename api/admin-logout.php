<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

unset($_SESSION["admin"]);

echo json_encode([
    "success" => true,
    "message" => "ออกจากระบบ Admin สำเร็จ"
]);

exit;

?>