const orderId =
    localStorage.getItem("currentOrderId");


const orderTotal =
    localStorage.getItem("currentOrderTotal");


const orderIdElement =
    document.querySelector("#order-id");


const orderTotalElement =
    document.querySelector("#order-total");


const slipInput =
    document.querySelector("#payment-slip");


const confirmPayment =
    document.querySelector("#confirm-payment");


const backCheckout =
    document.querySelector("#back-checkout");


// ==============================
// ตรวจสอบ Order
// ==============================

if (!orderId) {

    alert("ไม่พบคำสั่งซื้อ");

    window.location.href =
        "../main/main.html";

}


// ==============================
// แสดงข้อมูล Order
// ==============================

orderIdElement.textContent =
    orderId;


orderTotalElement.textContent =
    "฿" +
    Number(orderTotal).toLocaleString("th-TH");


// ==============================
// ยืนยันการชำระเงิน
// ==============================

confirmPayment.addEventListener(
    "click",
    uploadPaymentSlip
);


// ==============================
// Upload Slip
// ==============================

async function uploadPaymentSlip() {

    const file =
        slipInput.files[0];


    if (!file) {

        alert(
            "กรุณาเลือกสลิปการโอนเงิน"
        );

        return;

    }


    if (!orderId) {

        alert(
            "ไม่พบเลขที่คำสั่งซื้อ"
        );

        return;

    }


    console.log(
        "Order:",
        orderId
    );


    console.log(
        "Slip:",
        file
    );


    const formData =
        new FormData();


    formData.append(
        "orderId",
        orderId
    );


    formData.append(
        "slip",
        file
    );


    confirmPayment.disabled =
        true;


    confirmPayment.textContent =
        "กำลังอัปโหลด...";


    try {

        const response =
            await fetch(
                "../api/payment-upload.php",
                {

                    method: "POST",

                    credentials: "include",

                    body: formData

                }
            );


        console.log(
            "HTTP:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Payment:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "อัปโหลดสลิปไม่สำเร็จ"
            );

            return;

        }


        alert(
            "อัปโหลดสลิปสำเร็จ\n" +
            "กำลังรอตรวจสอบการชำระเงิน"
        );


        // ==========================
        // ล้าง Order ปัจจุบัน
        // ==========================

        localStorage.removeItem(
            "currentOrderId"
        );


        localStorage.removeItem(
            "currentOrderTotal"
        );


        // ==========================
        // ล้างตะกร้า
        // ==========================

        localStorage.removeItem(
            "cart"
        );


        // ==========================
        // กลับหน้าหลัก
        // ==========================

        window.location.href =
            "../main/main.html";


    } catch (error) {

        console.error(
            "UPLOAD SLIP ERROR:",
            error
        );


        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );


    } finally {

        confirmPayment.disabled =
            false;


        confirmPayment.textContent =
            "ยืนยันการชำระเงิน";

    }

}


// ==============================
// กลับ Checkout
// ==============================

backCheckout.addEventListener(
    "click",
    function () {

        window.location.href =
            "../checkout/checkout.html";

    }
);

