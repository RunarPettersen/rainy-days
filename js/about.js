import { addCartToHTML, changeQuantityCart } from './assets/cart.js';
import { setupLoader } from './assets/loader.js';
import { setActiveLink } from './assets/menu.js';
import { setupCartIcon } from './assets/cartIcon.js';

setupLoader();
setActiveLink();
setupCartIcon();

let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let products = [];
let cart = [];

const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        const data = await response.json();
        products = data;
        console.log('Products fetched:', products);

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
        }
    } catch (error) {
        alert('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);