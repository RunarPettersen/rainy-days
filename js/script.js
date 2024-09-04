import { addCartToHTML, changeQuantityCart } from './utils/cart.js';
import { updateDetailWithRandomProduct } from './utils/randomProduct.js';
import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/message.js';
import { setActiveLink } from './utils/menu.js';
import { setupCartIcon, triggerShakeAnimation } from './utils/cartIcon.js';
import { addDataToHTML } from './utils/addDataToHTML.js';

setupLoader();
setActiveLink();
setupCartIcon();

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let detail = document.querySelector('.main-heading');
let products = [];
let cart = [];

const getRandomProduct = () => {
    if (products.length === 0) {
        console.error('No products available to select randomly.');
        return null;
    }
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
};

const addProductToCart = (productId, size = 'Undefined') => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == productId && value.size == size);
    if (positionThisProductInCart < 0) {
        cart.push({
            product_id: productId,
            size: size,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    addCartToMemory();
    triggerShakeAnimation(iconCart);
    displayMessage('Item added to cart', 'success');
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        if (!response.ok) {
            throw new Error('Failed to fetch products. Please try again later.');
        }
        const data = await response.json();
        products = data;
        addDataToHTML(products, listProductHTML, addProductToCart);
        updateDetailWithRandomProduct(getRandomProduct, addProductToCart, detail);

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        displayMessage('Failed to load products. Please check your internet connection and try again.', 'error');
    }
};

document.addEventListener('DOMContentLoaded', initApp);