const orderList =
    document.querySelector("#order-list");


// ==============================
// โหลดคำสั่งซื้อ
// ==============================

async function loadOrders() {

    if (!orderList) {
        return;
    }


    orderList.innerHTML =
        "<p>กำลังโหลดคำสั่งซื้อ...</p>";


    try {

        const response =
            await fetch(
                "../api/my-orders.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "My Orders:",
            result
        );


        if (!result.success) {

            orderList.innerHTML =
                `<p>${result.message}</p>`;

            return;

        }


        if (!Array.isArray(result.orders)) {

            orderList.innerHTML =
                "<p>ข้อมูลคำสั่งซื้อไม่ถูกต้อง</p>";

            return;

        }


        if (result.orders.length === 0) {

            orderList.innerHTML =
                "<p>ยังไม่มีคำสั่งซื้อ</p>";

            return;

        }


        orderList.innerHTML = "";


        result.orders.forEach(order => {

            const card =
                document.createElement("div");


            card.classList.add(
                "order-card"
            );


            let statusText = "";
            let statusClass = "";


            // ==========================
            // สถานะ Order
            // ==========================

            if (order.status === "pending") {

                statusText =
                    "⏳ รอตรวจสอบ";

                statusClass =
                    "pending";

            }

            else if (
                order.status === "confirmed"
            ) {

                statusText =
                    "🟢 ยืนยันคำสั่งซื้อแล้ว";

                statusClass =
                    "confirmed";

            }

            else if (
                order.status === "shipping"
            ) {

                statusText =
                    "🚚 กำลังจัดส่ง";

                statusClass =
                    "shipping";

            }

            else if (
                order.status === "completed"
            ) {

                statusText =
                    "✅ จัดส่งสำเร็จ";

                statusClass =
                    "completed";

            }

            else {

                statusText =
                    order.status;

            }


            // ==========================
            // Payment Status
            // ==========================

            let paymentText = "";


            if (
                order.payment_status === "pending"
            ) {

                paymentText =
                    "รอชำระเงิน";

            }

            else if (
                order.payment_status === "waiting"
            ) {

                paymentText =
                    "รอตรวจสอบสลิป";

            }
            
            else if (
                order.payment_status === "rejected"
            ) {

                paymentText =
                    "ชำระเงินถูกปฏิเสธ";

            }

            else if (
                order.payment_status === "paid"
            ) {

                paymentText =
                    "ชำระเงินแล้ว";

            }


            else {

                paymentText =
                    order.payment_status;

            }


            // ==========================
            // Card
            // ==========================

            card.innerHTML = `

                <div class="order-info">

                    <h3>
                        ${order.order_id}
                    </h3>


                    <p>
                        ยอดรวม:
                        ฿${Number(order.total)
                            .toLocaleString("th-TH")}
                    </p>


                    <p>
                        วิธีชำระเงิน:
                        ${order.payment_method}
                    </p>


                    <p>
                        การชำระเงิน:
                        ${paymentText}
                    </p>


                    <p>
                        สถานะ:
                        <span
                            class="order-status ${statusClass}"
                        >
                            ${statusText}
                        </span>
                    </p>


                    <p>
                        วันที่:
                        ${order.created_at}
                    </p>

                </div>

                <button
                class="detail-btn"
                onclick="viewOrder('${order.order_id}')"
                >
                ดูรายละเอียด
                </button>

            `;


            orderList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "LOAD ORDERS ERROR:",
            error
        );


        orderList.innerHTML =
            `<p>เกิดข้อผิดพลาด: ${error.message}</p>`;

    }

}


loadOrders();

function viewOrder(orderId) {

    window.location.href =
        `order-detail.html?orderId=${encodeURIComponent(orderId)}`;

}

window.viewOrder = viewOrder;