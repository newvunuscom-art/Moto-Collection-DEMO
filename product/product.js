const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

console.log("Product ID:", productId);

const products = JSON.parse(
    localStorage.getItem("products")
) || [];

console.log("Products:", products);

const product = products.find(
    item => item.id === productId
);


console.log("Product:", product);

const productDetail = document.querySelector("#product-detail");

if (!productDetail) {
    console.error("ไม่พบ #product-detail ใน HTML");
} 
else if (!product) {

    productDetail.innerHTML = `
        <h1>ไม่พบสินค้า</h1>
        <a href="../main/main.html">กลับหน้าสินค้า</a>
    `;

} 
else {

    productDetail.innerHTML = `

        <div class="product-image">
            <img 
                src="${product.image}" 
                alt="${product.name}"
            >
        </div>

        <div class="product-info">

            <h1>${product.name}</h1>

            <p class="price">
                ฿${product.price}
            </p>

            <p>
                เหลือ ${product.stock} ชิ้น
            </p>

            <label for="quantity">
                จำนวน
            </label>

            <input
                type="number"
                id="quantity"
                value="1"
                min="1"
                max="${product.stock}"
            >

            <button id ="addcart" ${product.stock <= 0 ? "disabled" : ""}>
                ${
                    product.stock <= 0
                    ? "สินค้าหมด"
                    : "เพิ่มลงตะกร้า"
                }
            </button>

        </div>
    `;
}

const addCartBtn = document.querySelector("#addcart");

addCartBtn.addEventListener("click", function () {

    const quantity = Number(
        document.querySelector("#quantity").value
    );
    
    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];
    
    
    if(quantity <= 0 ){
        alert("กรุณาใส่จำนวนสินค้า");
        return;
    }
    
    if(quantity > product.stock){
        alert("สินค้าในสต็อกไม่เพียงพอ");
        return;
    }
    
    const existingProduct = cart.find(
        item => item.id === product.id
    );
    

    if(existingProduct){

        if(existingProduct.quantity + quantity > product.stock){

        alert("จำนวนสินค้าในสต็อก");
        return;
        }

        existingProduct.quantity += quantity;

        }
        else {
            cart.push({
                id: product.id,
                name:product.name,
                image:product.image,
                price:product.price,
                stock:product.stock,
                quantity:quantity
            });
        }
        localStorage.setItem(
        "cart",
        JSON.stringify(cart)
        );

        updateCartCount();

        alert("เพิ่มสินค้าเรียบร้อยแล้ว");

console.log("cart:", cart);
});

function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const cartCount = document.querySelector("#cart-count");

    if(!cartCount) return;

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,0
    );
    cartCount.textContent = totalQuantity;
}

updateCartCount();