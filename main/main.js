let products = [];

const productList =
    document.querySelector("#productlist");


async function loadProducts() {

    try {

        const response =
            await fetch(
                "../api/products.php"
            );

        const result =
            await response.json();

        console.log(
            "Products:",
            result
        );


        if (!result.success) {

            console.error(
                result.message
            );

            return;

        }


        products =
            result.products;


        showproducts();


    } catch (error) {

        console.error(
            "โหลดสินค้าไม่สำเร็จ:",
            error
        );

    }

}


function showproducts() {

    productList.innerHTML = "";


    if (products.length === 0) {

        productList.innerHTML =
            "<p>ยังไม่มีสินค้า</p>";

        return;

    }


    products.forEach(product => {

        const card =
            document.createElement("div");

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
                สต็อก:
                ${product.stock}
                ชิ้น
            </p>


        <button onclick="viewProduct(${product.id})" ${product.stock <= 0 ? "disabled" : ""}> ${product.stock <= 0 ? "สินค้าหมด" : "ซื้อสินค้า"}</button>


        `;


        productList.appendChild(card);

    });

}


loadProducts();

function viewProduct(id) {

    window.location.href =
        `../product-detail/product-detail.html?id=${id}`;

}
async function loadUser() {

    try {

        const response = await fetch(
            "../api/me.php",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const result = await response.json();

        console.log("User:", result);

        const userName =
            document.querySelector("#user-name");
            
        const userButton =
            document.querySelector("#user-button");

        const userDropdown =
            document.querySelector("#user-dropdown");

        if (!result.success) {

            userName.textContent = "เข้าสู่ระบบ";

            userButton.onclick = function (){
                
                window.location.href = "../login/login.html";
            };

            if(userDropdown){
                userDropdown.classList.remove("show");
            }

            return;
        }


        userName.textContent =
            result.user.name;

    } catch (error) {

        console.error(
            "โหลดข้อมูล User ไม่สำเร็จ:",
            error
        );

    }

}

loadUser();

const userButton =
    document.querySelector("#user-button");

const userDropdown =
    document.querySelector("#user-dropdown");


userButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        userDropdown.classList.toggle("show");
        
    }
);
const logoutBtn =
    document.querySelector("#logout-btn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            const confirmLogout =
                confirm(
                    "ต้องการออกจากระบบหรือไม่?"
                );


            if (!confirmLogout) {

                return;

            }


            try {

                const response =
                    await fetch(
                        "../api/logout.php",
                        {
                            method: "POST",
                            credentials: "include"
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    alert(
                        "ออกจากระบบสำเร็จ"
                    );

                    window.location.href =
                        "../main/main.html";

                } else {

                    alert(
                        result.message
                    );

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

function addToCart(id) {

    const product =
        products.find(
            product => product.id === id
        );

    if (!product) {

        alert("ไม่พบสินค้า");

        return;
    }


    if (product.stock <= 0) {

        alert("สินค้าหมด");

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existing =
        cart.find(
            item => item.id === product.id
        );


    if (existing) {

        if (
            existing.quantity >= product.stock
        ) {

            alert(
                "สินค้าในสต็อกไม่เพียงพอ"
            );

            return;
        }

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            image: product.image,

            price: product.price,

            stock: product.stock,

            quantity: 1

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
}

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

function openProduct(id) {

    window.location.href =
        `../product-detail/product-detail.html?id=${id}`;

}