const products = [
    {
        id: 1,
        name: "Test",
        image: "https://placehold.co/300x200",
        price: 180,
        stock: 20
    },

    {
        id: 2,
        name: "Test",
        image: "https://placehold.co/300x200",
        price: 150,
        stock: 15
    },

    {
        id: 3,
        name: "Test",
        image: "https://placehold.co/300x200",
        price: 200,
        stock: 10
    },

    {
        id: 4,
        name: "Test",
        image: "https://placehold.co/300x200",
        price: 200,
        stock: 10
    }
];

const productlist = document.querySelector("#productlist");

products.forEach(product => {

    productlist.innerHTML += `
        <div class ="container">
        <div class="card">
        <div class ="box-pd">
            <img src="${product.image}" alt="${product.name}">

            <h2>${product.name}</h2>

            <div class = "textend">            
            <p>฿${product.price}</p>
            <p>เหลือ ${product.stock} ชิ้น</p>
            </div>
        </div>
        </div>
        </div>
    `;

});
console.log(product);
console.log(product.image);