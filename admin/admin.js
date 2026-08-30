


async function CheckAdmin() {

    try {

        const response = await fetch(
            "../api/admin-me.php",
            {
                method: "GET",
                credentials: "include"
            }
        );


        const result =
            await response.json();


        console.log(
            "ADMIN RESULT =",
            result
        );


        if (!result.success) {

            alert(
                "กรุณาเข้าสู่ระบบ Admin ก่อน"
            );

            window.location.href =
                "admin-login.html";

            return false;
        }


        console.log(
            "ADMIN DATA =",
            result.admin
        );


        const adminName =
            document.querySelector(
                "#admin-name"
            );


        if (adminName) {

            adminName.textContent =
                result.admin.name ||
                result.admin.username ||
                "Admin";

        }


        return true;


    } catch (error) {

        console.error(
            "CHECK ADMIN ERROR:",
            error
        );

        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

        return false;

    }

}


////////////////////////////////product////////////////////////////

let products = [];

const productList = document.querySelector("#productlist");


async function loadProducts() {

    try {

        const response =
            await fetch(
                "../api/products.php",
                {
                    method:"GET",
                    credentials:"include"
                }
            );


        const result =
            await response.json();


        console.log(
            "Products:",
            result
        );


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        products =
            result.products;


        showproducts();


    } catch (error) {

        console.error(error);

        alert(
            "ไม่สามารถโหลดสินค้าได้"
        );

    }

}


function showproducts() {

    productList.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("card");

       card.innerHTML = `

            <img
                src="../${product.image}"
                alt="${product.name}"
            >

            <h2>
                ${product.name}
            </h2>

            <p>
                ราคา: ฿${product.price}
            </p>

            <p>
                สต็อก: ${product.stock} ชิ้น
            </p>

            <button
                onclick="deleteProduct(${product.id})"
            >
                ลบ
            </button>

        `;

        productList.appendChild(card);

    });

}


const productForm = document.querySelector("#productform");


productForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document
                .querySelector("#product-name")
                .value
                .trim();


        const price =
            document
                .querySelector("#product-price")
                .value;


        const imageInput =
            document.querySelector("#product-image");


        const stock =
            document
                .querySelector("#product-stock")
                .value;

                if(imageInput.files.length === 0 ) {
                    alert("กรุณาใส่รูปภาพ");
                    return;
                }

                const image = imageInput.files[0];


                const formData = new FormData();

                formData.append( "name", name);
                formData.append( "price", price);
                formData.append( "stock", stock);
                formData.append( "image", image);
                

        try {

            const response =
                await fetch(
                    "../api/product-add.php",
                    {

                        method: "POST",

                        credentials: "include",

                       body: formData
                    }
                );

            const result =
                await response.json();


            console.log(
                "Add Product:",
                result
            );


            if (!result.success) {

                alert(
                    result.message
                );

                return;

            }


            alert(
                "เพิ่มสินค้าสำเร็จ"
            );


            productForm.reset();


            await loadProducts();


        } catch (error) {

            console.error(error);

            alert(
                "ไม่สามารถเชื่อมต่อ Server ได้"
            );

        }

    }
);


async function deleteProduct(id) {

    if (
        !confirm(
            "คุณต้องการลบสินค้านี้หรือไม่?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                "../api/product-delete.php",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        id: id
                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Delete Product:",
            result
        );


        if (!result.success) {

            alert(
                result.message
            );

            return;

        }


        await loadProducts();


    } catch (error) {

        console.error(error);

        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

    }

}

window.deleteProduct = deleteProduct; 

/////////////////////////////////////////////////////////////////////////////

// ==============================
// LOGOUT
// ==============================

const logoutButton =
    document.querySelector("#admin-logout");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "../api/admin-logout.php",
                        {
                            method: "POST",
                            credentials: "include"
                        }
                    );

                const result =
                    await response.json();

                console.log("Logout:", result);

                if (result.success) {

                    window.location.href =
                        "admin-login.html";

                }

            } catch (error) {

                console.error(error);

                alert(
                    "ไม่สามารถเชื่อมต่อ Server ได้"
                );

            }

        }
    );
}


// ==============================
// START ADMIN
// ==============================

async function startAdmin() {

    const isAdmin =
        await CheckAdmin();


    if (!isAdmin) {

        return;

    }


    await loadProducts();

}


startAdmin();

///////////////////// Order /////////////////////////

const orderList =
    document.querySelector("#order-list");


async function loadAdminOrders() {

    if (!orderList) {
        return;
    }


    orderList.innerHTML =
        "<p>กำลังโหลดคำสั่งซื้อ...</p>";


    try {

        const response =
            await fetch(
                "../api/admin-orders.php",
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
            "Admin Orders:",
            result
        );


        if (!result.success) {

            orderList.innerHTML =
                `<p>${result.message || "โหลดคำสั่งซื้อไม่สำเร็จ"}</p>`;

            return;

        }


        if (!Array.isArray(result.orders)) {

            console.error(
                "orders ไม่ใช่ Array:",
                result
            );

            orderList.innerHTML =
                "<p>รูปแบบข้อมูลคำสั่งซื้อไม่ถูกต้อง</p>";

            return;

        }


        if (result.orders.length === 0) {

            orderList.innerHTML =
                "<p>ไม่มีคำสั่งซื้อที่รอตรวจสอบ</p>";

            return;

        }


        orderList.innerHTML = "";


       result.orders.forEach(order => {

    const card =
        document.createElement("div");

    card.classList.add("order-card");


    // ==============================
    // ปุ่มตามสถานะ Order
    // ==============================


let statusButton = "";

if (order.status === "confirmed") {

    statusButton = `
        <button
            class="shipping-btn"
            onclick="updateOrderStatus(
                '${order.order_id}',
                'shipping'
            )"
            style="background: orange;"
        >
            🚚 จัดส่งสินค้า
        </button>
    `;

}

else if (order.status === "shipping") {

    statusButton = `
        <button
            class="completed-btn"
            onclick="updateOrderStatus(
                '${order.order_id}',
                'waiting_confirmation'
            )"
            style="background: green;"
        >
            ✓ ส่งสำเร็จ
        </button>
    `;

}

else if (
    order.status === "waiting_confirmation"
) {

    statusButton = `
        <p style="color: orange;">
            ⏳ รอลูกค้ายืนยันการรับสินค้า
        </p>
    `;

}

else if (
    order.status === "completed"
) {

    statusButton = `
        <p style="color: green;">
            ✅ ลูกค้ายืนยันรับสินค้าแล้ว
        </p>
    `;

}


    // ==============================
    // สร้าง Card
    // ==============================

    card.innerHTML = `

        <div class="order-info">

            <h3>
                ${order.order_id}
            </h3>

            <p>
                ยอดรวม:
                ฿${Number(order.total).toLocaleString("th-TH")}
            </p>

            <p>
                วิธีชำระเงิน:
                ${order.payment_method}
            </p>

            <p>
                สถานะ:
                ${order.status}
            </p>

            <p>
                วันที่:
                ${order.created_at}
            </p>

        </div>

        <div class="order-slip">

            <img
                src="../${order.slip}"
                alt="สลิปการชำระเงิน"
            >

        </div>

        <div class="order-actions">

    ${
        order.payment_status === "waiting"
        ? `
            <button
                class="approve-btn"
                onclick="approvePayment('${order.order_id}')"
                style="background:green;"
            >
                อนุมัติ
            </button>

            <button
                class="reject-btn"
                onclick="rejectPayment('${order.order_id}')"
                style="background:red;"
            >
                ปฏิเสธ
            </button>
        `
        : ""
    }

</div>

        


        <div class="order-actions">

            ${statusButton}

        </div>

    `;


    orderList.appendChild(card);

    });


    } catch (error) {

    console.error(
        "LOAD ADMIN ORDERS ERROR:",
        error
    );

    console.error(
        "ERROR MESSAGE:",
        error.message
    );

    orderList.innerHTML =
        `<p>เกิดข้อผิดพลาด: ${error.message}</p>`;

    }
}



async function approvePayment(orderId) {

    const confirmApprove =
        confirm(
            "ต้องการอนุมัติการชำระเงินของ " +
            orderId +
            " หรือไม่?"
        );

    if (!confirmApprove) {
        return;
    }

    try {

        const response =
            await fetch(
                "../api/admin-payment-approve.php",
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
            "Approve:",
            result
        );

        if (!result.success) {

            alert(
                result.message ||
                "อนุมัติการชำระเงินไม่สำเร็จ"
            );

            return;
        }

        alert(
            "อนุมัติการชำระเงินสำเร็จ"
        );

        await loadAdminOrders();

    } catch (error) {

        console.error(
            "APPROVE ERROR:",
            error
        );

        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

    }

}


async function rejectPayment(orderId) {

    const confirmReject =
        confirm(
            "ต้องการปฏิเสธสลิปของ " +
            orderId +
            " หรือไม่?"
        );

    if (!confirmReject) {
        return;
    }

    try {

        const response =
            await fetch(
                "../api/admin-payment-reject.php",
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

       const text =
    await response.text();

console.log(
    "REJECT RAW RESPONSE:",
    text
);

let result;

try {

    result =
        JSON.parse(text);

} catch (error) {

    console.error(
        "REJECT JSON ERROR:",
        error
    );

    alert(
        "PHP มี Error กรุณาดู Console"
    );

    return;
}

        console.log(
            "Reject:",
            result
        );

        if (!result.success) {

            alert(
                result.message ||
                "ปฏิเสธการชำระเงินไม่สำเร็จ"
            );

            return;
        }

        alert(
            "ปฏิเสธการชำระเงินแล้ว"
        );

        await loadAdminOrders();

    } catch (error) {

        console.error(
            "REJECT ERROR:",
            error
        );

        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

    }

}


// ทำให้ onclick="" ใน HTML มองเห็นฟังก์ชัน
window.approvePayment = approvePayment;

window.rejectPayment = rejectPayment;

async function updateOrderStatus(orderId, status) {

    let message = "";

    if (status === "shipping") {

        message =
            "ต้องการเปลี่ยนสถานะเป็นกำลังจัดส่งหรือไม่?";

    } else if (status === "completed") {

        message =
            "ยืนยันว่าจัดส่งสินค้าเรียบร้อยแล้วหรือไม่?";

    }


    if (!confirm(message)) {
        return;
    }


    try {

        const response =
            await fetch(
                "../api/admin-order-status.php",
                {

                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        orderId: orderId,

                        status: status

                    })

                }
            );


        const result =
            await response.json();


        console.log(
            "Update Order Status:",
            result
        );


        if (!result.success) {

            alert(
                result.message ||
                "เปลี่ยนสถานะไม่สำเร็จ"
            );

            return;

        }


        alert(
            "เปลี่ยนสถานะสำเร็จ"
        );


        await loadAdminOrders();


    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );


        alert(
            "ไม่สามารถเชื่อมต่อ Server ได้"
        );

    }

}

window.updateOrderStatus = updateOrderStatus;
loadAdminOrders();

