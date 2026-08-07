let products = JSON.parse(localStorage.getItem("products")) || [];


const productList = document.querySelector("#productlist");


function showproducts() {

    productList.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <p>ราคา: ฿${product.price}</p>

            <p>สต็อก: ${product.stock} ชิ้น</p>

            <button onclick="deleteProduct(${product.id})">
                ลบ
            </button>
        `;

        productList.appendChild(card);

    });

}


const productForm = document.querySelector("#productform");


productForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.querySelector("#product-name").value;

    const price =
        document.querySelector("#product-price").value;

    const image =
        document.querySelector("#product-image").value;

    const stock =
        document.querySelector("#product-stock").value;


    const product = {

        id: Date.now(),

        name: name,

        image: image,

        price: Number(price),

        stock: Number(stock)

    };


    products.push(product);


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    showproducts();

    productForm.reset();

});


function deleteProduct(id) {

    if (!confirm("คุณต้องการลบสินค้านี้หรือไม่?")) {
        return;
    }


    products = products.filter(
        product => product.id !== id
    );


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    showproducts();

}


showproducts();
console.log(products);