
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

const productList = document.querySelector("#productlist");

function viewProduct(id) {
    window.location.href = `../product/product.html?id=${id}`;
}

function showproducts() {

    productList.innerHTML = "";

    products.forEach(product =>{
        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML =`
        <div class="box-pd">
        <img src = "${product.image}" alt = "${product.name}">
        <div class ="card-info"
        <h2>${product.name}</h2>
        <div class ="textend">
        <p>฿${product.price}</p>
        <p>เหลือ ${product.stock} ชิ้น</p>

        </div>
        <div class="btn">
        <button onclick="viewProduct(${product.id})" ${product.stock <= 0 ? "disabled" : ""}> ${product.stock <= 0 ? "สินค้าหมด" : "ซื้อสินค้า"}</button>
        </div>
        </div>
        </div>
        `
        productList.appendChild(card);
    }); 

}

function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const cartCount = document.querySelector("#cart-count");

    if (!cartCount) return;

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
}

updateCartCount();

window.addEventListener(
    "storage",
    updateCartCount
);

showproducts();

console.log(products);