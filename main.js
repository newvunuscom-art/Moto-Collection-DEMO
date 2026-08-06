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

const cards = document.querySelectorAll(".card");

products.forEach((product, index) => {
    
    cards[index].querySelector("img").src = product.image;

    cards[index].querySelector(".product-name").textContent = product.name;

    cards[index].querySelector(".product-price").textContent =
        `฿ ${product.price}`;

    cards[index].querySelector(".product-stock").textContent =
       `เหลือ ${product.stock} ชิ้น`;
}); 

console.log(product);
console.log(product.image);