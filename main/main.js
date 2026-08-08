
let products = JSON.parse(
    localStorage.getItem("products")
) || [];

const productList = document.querySelector("#productlist");

function showproducts() {

    productList.innerHTML = "";

    products.forEach(product =>{
        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML =`
        <img src = "${product.image}" alt = "${product.name}">

        <h2>${product.name}</h2>
        
        <p>฿${product.price}</p>

        <p>เหลือ ${product.stock} ชิ้น</p>

        <button ${product.stock <= 0 ? "disabled" : ""}> ${product.stock <= 0 ? "สินค้าหมด" : "ซื้อสินค้า"}</button>
        
        `
        productList.appendChild(card);
    }); 

}
showproducts();

console.log(products);