<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$sql = "
    SELECT
        id,
        name,
        price,
        image,
        stock
    FROM products
    ORDER BY id DESC
";

$result = $conn->query($sql);

if (!$result) {

    echo json_encode([
        "success" => false,
        "message" => "ไม่สามารถดึงข้อมูลสินค้าได้"
    ]);

    exit;
}


$products = [];


while ($row = $result->fetch_assoc()) {

    $row["id"] = (int)$row["id"];
    $row["price"] = (float)$row["price"];
    $row["stock"] = (int)$row["stock"];

    $products[] = $row;
}


echo json_encode([
    "success" => true,
    "products" => $products
]);

?>