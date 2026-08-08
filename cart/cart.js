let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

const cartList = document.querySelector("#cart-list");
const totalElement = document.querySelector("#total");

function showCart() {

    cartList.innerHTML = "";

    if (cart.length === 0) {

        cartList.innerHTML = `
            <h2>ไม่มีสินค้าในตะกร้า</h2>
        `;

        totalElement.textContent = "฿0";

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const card = document.createElement("div");

        card.classList.add("cart-item");

        card.innerHTML = `
            
            <img 
                src="${item.image}" 
                alt="${item.name}"
            >

            <div>
                <h2>${item.name}</h2>

                <p>
                    ราคา ฿${item.price}
                </p>

                <p>
                    จำนวน ${item.quantity}
                </p>

                <p>
                    รวม ฿${itemTotal}
                </p>

                <button onclick="removeCart(${item.id})">
                    ลบ
                </button>
            </div>

        `;

        cartList.appendChild(card);
    });

    totalElement.textContent = `฿${total}`;
}


function removeCart(id) {

    if (!confirm("ต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?")) {
        return;
    }

    cart = cart.filter(
        item => item.id !== id
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    showCart();
}


showCart();
console.log(cart);