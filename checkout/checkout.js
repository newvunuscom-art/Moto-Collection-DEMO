let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


const checkoutList =
    document.querySelector("#checkout-list");

const checkoutTotal =
    document.querySelector("#checkout-total");

const confirmOrder =
    document.querySelector("#confirm-order");

function showCheckout() {

    checkoutList.innerHTML = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;


        checkoutList.innerHTML += `

            <div class="checkout-item">

                <img
                    src="${item.image}"
                    width="100"
                >

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ราคา ฿${item.price}
                    </p>

                    <p>
                        จำนวน ${item.quantity}
                    </p>

                    <p>
                        รวม ฿${itemTotal}
                    </p>

                </div>

            </div>

        `;

    });


    checkoutTotal.textContent =
        `฿${total}`;

}

showCheckout();




function generateOrderId() {

    return "ORD-" + Date.now();

}

const N8N_WEBHOOK =
    "https://moyou56.app.n8n.cloud/webhook-test/order";



async function sendOrderToN8N() {

    const name =
        document
            .querySelector("#customer-name")
            .value
            .trim();


    const phone =
        document
            .querySelector("#customer-phone")
            .value
            .trim();


    const address =
        document
            .querySelector("#customer-address")
            .value
            .trim();


    if (!name || !phone || !address) {

        alert("กรุณากรอกข้อมูลให้ครบ");

        return;

    }


    if (cart.length === 0) {

        alert("ไม่มีสินค้าในตะกร้า");

        return;

    }



    const orderId =
        generateOrderId();



    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );




    const orderData = {

        orderId: orderId,

        customer: {

            name: name,

            phone: phone,

            address: address

        },

        products: cart,

        total: total,

        paymentMethod:
            document.querySelector(
                'input[name="payment"]:checked'
            ).value,

        createdAt:
            new Date().toISOString()

    };


    console.log(
        "กำลังส่ง:",
        orderData
    );


    try {

        const response =
            await fetch(
                N8N_WEBHOOK,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                "ส่งข้อมูลไม่สำเร็จ"
            );

        }


        alert(
            "ส่งคำสั่งซื้อเรียบร้อยแล้ว"
        );


        console.log(
            "ส่งไป n8n สำเร็จ"
        );


    }

    catch (error) {

        console.error(
            "ERROR:",
            error
        );


        alert(
            "ไม่สามารถส่งคำสั่งซื้อได้"
        );

    }

}


confirmOrder.addEventListener(
    "click",
    sendOrderToN8N
);