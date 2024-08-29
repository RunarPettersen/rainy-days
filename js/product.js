import { addCartToHTML, changeQuantityCart } from './cart.js';
import { setupLoader } from './loader.js';

setupLoader();

let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let productListTitle = document.querySelector('.title');
let sortPriceSelect = document.querySelector('#sortPrice');
let sortPriceTitle = document.querySelector('.sorting-controls');
let genderControls = document.querySelector('.gender-controls');
let genderFilterSelect = document.querySelector('#genderFilter');
let products = [];
let cart = [];

// Event listeners for cart toggling
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Event listener for sorting by price
sortPriceSelect.addEventListener('change', () => {
    sortProductsByPrice(sortPriceSelect.value);
    addDataToHTML();
});

// Event listener for filtering by gender
genderFilterSelect.addEventListener('change', () => {
    addDataToHTML();
});

// Fetch the product ID from the URL
const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

// Sort products by price
const sortProductsByPrice = (order) => {
    products.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
};

// Render products to the HTML
const addDataToHTML = () => {
    const productId = getProductIdFromURL();
    const selectedGender = genderFilterSelect.value;

    if (productId) {
        // Hide unnecessary elements when showing a single product
        productListTitle.style.display = 'none';
        myProductHTML.style.display = 'none';
        sortPriceSelect.style.display = 'none';
        sortPriceTitle.style.display = 'none';
        genderFilterSelect.style.display = 'none';
        genderControls.style.display = 'none';

        const product = products.find(product => product.id == productId);
        if (product) {
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            let productDetail = document.createElement('div');
            productDetail.classList.add('item');
            productDetail.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <div class="description">${product.description}</div>
                <div class="gender">Gender: ${product.gender}</div>
                <div class="gender">Color: ${product.baseColor}</div>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector" id="${product.title}" name="${product.title}">${sizesOptions}</select>
                <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
            myProductHTML.appendChild(productDetail);
            myProductHTML.style.display = 'block';
        }
    } else {
        // Filter products based on gender selection
        let filteredProducts = products;
        if (selectedGender !== 'all') {
            filteredProducts = products.filter(product => product.gender.toLowerCase() === selectedGender);
        }

        if (filteredProducts.length > 1) {
            productListTitle.style.display = 'block';
            myProductHTML.innerHTML = '';
            sortPriceSelect.style.display = 'block'; // Show price sorter

            filteredProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
                newProduct.innerHTML = `
                    <a href="index.html?id=${product.id}"><img src="${product.image}" alt="${product.title}"></a>
                    <h2>${product.title}</h2>
                    <div class="description">${product.description}</div>
                    <div class="price">$${product.price}</div>
                    <select class="sizeSelector" id="${product.title}" name="${product.title}">${sizesOptions}</select>
                    <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
                myProductHTML.appendChild(newProduct);
            });
        } else {
            productListTitle.style.display = 'none';
            myProductHTML.style.display = 'none';
            sortPriceSelect.style.display = 'none'; // Hide price sorter
        }
    }
};

// Listener for add to cart button clicks
myProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.dataset.id;
        let size = positionClick.parentElement.querySelector('.sizeSelector').value;
        addToCart(id_product, size);
    }
});

// Add product to cart
const addToCart = (product_id, size) => {
    if (!size) {
        size = 'Undefined';
    }
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            size: size,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Correctly call imported function
    addCartToMemory();
};

// Store cart in localStorage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Initialize the application and fetch products
const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        const data = await response.json();
        products = data;
        addDataToHTML();

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Correctly call imported function
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);