const product = {
    id: 0,
    Image: "Moto-collection/icon/map.svg",
    price: 180
};

const producttlist = document.getElementById("#productlist");

productlist.innerHTML = `
    <div class="card">
        <img src="${product.image}" alt="produ">
        <p>ID: ${product.id}</p>
        <p>Price: ${product.price} บาท</p>
    </div>
`;

console.log(product);