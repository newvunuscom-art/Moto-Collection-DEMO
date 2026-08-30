const productDetail =
    document.querySelector("#product-detail");


const params =
    new URLSearchParams(
        window.location.search
    );


const productId =
    Number(params.get("id"));


console.log(
    "Product ID:",
    productId
);


let product = null;


async function loadProduct() {

    console.log(
        "กำลังโหลดสินค้า..."
    );


    try {

        const response =
            await fetch(
                "../api/products.php",
                {
                    method: "GET"
                }
            );


        console.log(
            "HTTP:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "Products:",
            result
        );


        if (!result.success) {

            productDetail.innerHTML = `
                <p>
                    ${
                        result.message ||
                        "โหลดสินค้าไม่สำเร็จ"
                    }
                </p>
            `;

            return;
        }


        product =
            result.products.find(
                item =>
                    Number(item.id) ===
                    productId
            );


        console.log(
            "Product:",
            product
        );


        if (!product) {

            productDetail.innerHTML = `
                <p>
                    ไม่พบสินค้านี้
                </p>
            `;

            return;
        }


        showProduct();


    } catch (error) {

        console.error(
            "LOAD PRODUCT ERROR:",
            error
        );


        productDetail.innerHTML = `
            <p>
                ไม่สามารถเชื่อมต่อ Server ได้
            </p>
        `;

    }

}


function showProduct() {

    productDetail.innerHTML = `

        <div class="product-image">

            <img
                src="../${product.image}"
                alt="${product.name}"
            >

        </div>


        <div class="product-info">

            <h1>
                ${product.name}
            </h1>


            <p class="price">
                ฿${product.price}
            </p>


            <p>
                เหลือ ${product.stock} ชิ้น
            </p>


            <div class="quantity-control">

                <button
                    id="minus"
                    type="button"
                >
                    −
                </button>


                <input
                    id="quantity"
                    type="number"
                    value="1"
                    min="1"
                    max="${product.stock}"
                >


                <button
                    id="plus"
                    type="button"
                >
                    +
                </button>

            </div>


            <button
                id="add-cart"
                type="button"
            >
                เพิ่มลงตะกร้า
            </button>

        </div>

    `;


    setupButtons();

}


function setupButtons() {

    const quantity =
        document.querySelector(
            "#quantity"
        );


    const minus =
        document.querySelector(
            "#minus"
        );


    const plus =
        document.querySelector(
            "#plus"
        );


    const addCart =
        document.querySelector(
            "#add-cart"
        );


    minus.addEventListener(
        "click",
        function () {

            let value =
                Number(
                    quantity.value
                );


            if (value > 1) {

                value--;

            }


            quantity.value =
                value;

        }
    );


    plus.addEventListener(
        "click",
        function () {

            let value =
                Number(
                    quantity.value
                );


            if (
                value < product.stock
            ) {

                value++;

            }


            quantity.value =
                value;

        }
    );


    addCart.addEventListener(
        "click",
        function () {

            addToCart(
                Number(
                    quantity.value
                )
            );

        }
    );

}


function addToCart(quantity) {

    if (
        quantity < 1 ||
        quantity > product.stock
    ) {

        alert(
            "จำนวนสินค้าไม่ถูกต้อง"
        );

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    if (existing) {

        if (
            existing.quantity +
            quantity >
            product.stock
        ) {

            alert(
                "สินค้าในสต็อกไม่เพียงพอ"
            );

            return;
        }


        existing.quantity +=
            quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            image: product.image,

            price: Number(product.price),

            stock: Number(product.stock),

            quantity: quantity

        });

    }


    localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);

updateCartCount();

alert(
    "เพิ่มสินค้าลงตะกร้าแล้ว"
);

document.querySelector("#quantity").value = 1;
    window.location.href =
    `../product-detail/product-detail.html?id=${id}`;

    window.location.reload();

}
loadProduct();
updateCartCount();


const backButton =
    document.querySelector("#back-btn");


if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "../main/main.html";

        }
    );

}


loadProduct();

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const cartCount =
        document.querySelector(
            "#cart-count"
        );


    if (!cartCount) {
        return;
    }


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
    totalQuantity;

}
updateCartCount();