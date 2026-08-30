const orderDetail =
    document.querySelector("#order-detail");


const backOrders =
    document.querySelector("#back-orders");


// ==============================
// รับ Order ID จาก URL
// ==============================

const params =
    new URLSearchParams(
        window.location.search
    );


const orderId =
    params.get("orderId");


if (!orderId) {

    alert(
        "ไม่พบเลขที่คำสั่งซื้อ"
    );

    window.location.href =
        "order-history.html";

}


// ==============================
// โหลดรายละเอียด
// ==============================

function getStepClass(status, step) {

    let currentStep = 1;


    if (status === "confirmed") {

        currentStep = 2;

    }

    else if (status === "shipping") {

        currentStep = 3;

    }

    else if (
        status === "waiting_confirmation"
    ) {

        currentStep = 4;

    }

    else if (status === "completed") {

        currentStep = 4;

    }


    if (step < currentStep) {

        return "completed";

    }


    if (step === currentStep) {

        return "active";

    }


    return "";

}

function getPaymentText(paymentStatus) {

    if (paymentStatus === "pending") {

        return "⏳ รอชำระเงิน";

    }


    if (paymentStatus === "waiting") {

        return "🔍 รอตรวจสอบสลิป";

    }


    if (paymentStatus === "paid") {

        return "✅ ชำระเงินแล้ว";

    }


    if (paymentStatus === "rejected") {

        return "❌ การชำระเงินถูกปฏิเสธ";

    }


    return paymentStatus || "ไม่ทราบสถานะ";

}

async function loadOrderDetail() {

    try {

        const response =
            await fetch(
                "../api/order-detail.php",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        orderId: orderId

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Order Detail:",
            result
        );


        if (!result.success) {
        orderDetail.innerHTML =
        `<p>${result.message || "ไม่พบข้อมูลคำสั่งซื้อ"}</p>`;

        return;
        }


        const order =
            result.order;


        const products =
            result.products;

            let receiveButton = "";


if (
    order.status ===
    "waiting_confirmation"
) {

    receiveButton = `

        <div class="receive-confirm">

            <button
                id="confirm-received"
                onclick="confirmReceived('${order.order_id}')"
            >
                📦 ยืนยันว่าได้รับสินค้าแล้ว
            </button>

        </div>

    `;

}


else if (order.status === "completed") {

    receiveButton = `

        <div class="receive-confirm">

            <p style="color: green;">
                ✅ ยืนยันรับสินค้าแล้ว
            </p>

        </div>

    `;

}

        // ==========================
        // สถานะ
        // ==========================

        let statusText = "";


        if (order.status === "pending") {

    statusText =
        "⏳ รอตรวจสอบ";

}

else if (
    order.status === "confirmed"
) {

    statusText =
        "🟢 ยืนยันคำสั่งซื้อแล้ว";

}

else if (
    order.status === "shipping"
) {

    statusText =
        "🚚 กำลังจัดส่ง";

}

else if (
    order.status ===
    "waiting_confirmation"
) {

    statusText =
        "📦 รอลูกค้ายืนยันการรับสินค้า";

}

else if (
    order.status === "completed"
) {

    statusText =
        "✅ จัดส่งสำเร็จ";

}

else {

    statusText =
        order.status;

}


        // ==========================
        // สร้างรายการสินค้า
        // ==========================

        let productHTML = "";


        products.forEach(product => {

            const itemTotal =
                Number(product.price) *
                Number(product.quantity);


            productHTML += `

                <div class="order-product">

                    <img
                        src="../${product.image}"
                        alt="${product.name}"
                    >


                    <div class="product-info">

                        <h3>
                            ${product.name}
                        </h3>


                        <p>
                            ราคา:
                            ฿${Number(product.price)
                                .toLocaleString("th-TH")}
                        </p>


                        <p>
                            จำนวน:
                            ${product.quantity}
                        </p>


                        <p>
                            รวม:
                            ฿${itemTotal
                                .toLocaleString("th-TH")}
                        </p>

                    </div>

                </div>

            `;

        });


        // ==========================
        // แสดงผล
        // ==========================

        orderDetail.innerHTML = `

    <div class="order-header">

        <h2>
            ${order.order_id}
        </h2>

        <p>
            วันที่สั่งซื้อ:
            ${order.created_at}
        </p>

    </div>


    <!-- ==========================
         Timeline
    =========================== -->

    <div class="order-timeline">

        <div class="timeline-item ${getStepClass(order.status, 1)}">

            <div class="timeline-dot">
                ✓
            </div>

            <div class="timeline-content">

                <h3>
                    สั่งซื้อสินค้า
                </h3>

                <p>
                    สร้างคำสั่งซื้อแล้ว
                </p>

            </div>

        </div>


        <div class="timeline-item ${getStepClass(order.status, 2)}">

            <div class="timeline-dot">
                ✓
            </div>

            <div class="timeline-content">

                <h3>
                    ชำระเงิน
                </h3>

                <p>
                    ${getPaymentText(order.payment_status)}
                </p>

            </div>

        </div>


        <div class="timeline-item ${getStepClass(order.status, 3)}">

            <div class="timeline-dot">
                🚚
            </div>

            <div class="timeline-content">

                <h3>
                    กำลังจัดส่ง
                </h3>

                <p>
                    ${order.status === "shipping"
                        || order.status === "completed"
                        ? "กำลังจัดส่งสินค้า"
                        : "รอการจัดส่ง"}
                </p>

            </div>

        </div>


<div class="timeline-item ${getStepClass(order.status, 4)}">

    <div class="timeline-dot">
        ✓
    </div>

    <div class="timeline-content">

        <h3>
            จัดส่งสำเร็จ
        </h3>

        <p>
            ${
                order.status === "completed"
                ? "ได้รับสินค้าเรียบร้อยแล้ว"
                : order.status === "waiting_confirmation"
                ? "สินค้าถึงแล้ว กรุณายืนยันการรับสินค้า"
                : "รอจัดส่งสินค้า"
            }
        </p>

    </div>

</div>

    </div>


    <!-- ==========================
         Payment
    =========================== -->

    <div class="order-payment">

        <h2>
            การชำระเงิน
        </h2>

        <p>
            วิธีชำระเงิน:
            ${order.payment_method}
        </p>

        <p>
            สถานะ:
            ${getPaymentText(order.payment_status)}
        </p>

        <p>
            ยอดรวม:
            ฿${Number(order.total)
                .toLocaleString("th-TH")}
        </p>

    </div>


    <!-- ==========================
         Products
    =========================== -->

    <div class="order-products">

        <h2>
            รายการสินค้า
        </h2>

        ${productHTML}

    </div>

    ${receiveButton}

    `;
    }

    catch (error) {

        console.error(
            "ORDER DETAIL ERROR:",
            error
        );


        orderDetail.innerHTML =
            `<p>เกิดข้อผิดพลาด: ${error.message}</p>`;

    }

}


loadOrderDetail();
setInterval(
    loadOrderDetail,
    10000
);


async function confirmReceived(orderId) {

    const confirmed =
        confirm(
            "ยืนยันว่าได้รับสินค้าเรียบร้อยแล้วหรือไม่?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "../api/order-confirm-received.php",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        orderId: orderId

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Confirm Received:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "ยืนยันรับสินค้าไม่สำเร็จ"
            );

            return;
        }


        alert(
            "ยืนยันรับสินค้าเรียบร้อยแล้ว"
        );


        await loadOrderDetail();


    } catch (error) {

        console.error(
            "CONFIRM RECEIVED ERROR:",
            error
        );


        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

    }

}


window.confirmReceived = confirmReceived;