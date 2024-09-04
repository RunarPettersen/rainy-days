import { addCartToHTML } from './utils/cart.js';
import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/message.js';
import { setupCartIcon } from './utils/cartIcon.js';
import { addDataToHTML } from './utils/addDataToHTML.js';
import { updateCheckoutPage } from './utils/updateCheckoutPage.js';
import { addToCart, removeFromCart } from './utils/cartManager.js';
import { calculateFinalTotal, placeOrder } from './utils/orderManager.js';
import { baseurl } from './constants/api.js';

setupLoader();
setupCartIcon();

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let checkoutList = document.querySelector('.list');
let checkoutTotalQuantity = document.querySelector('.totalQuantity');
let checkoutTotalPrice = document.querySelector('.totalPrice');
let checkoutShippingSelect = document.querySelector('#shipping');
let checkoutShippingCost = document.querySelector('.shippingCost');
let checkoutFinalTotal = document.querySelector('.finalTotal');
let placeOrderButton = document.getElementById('placeOrder');
let products = [];
let cart = [];

if (checkoutShippingSelect) {
    checkoutShippingSelect.addEventListener('change', () => calculateFinalTotal(checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, checkoutTotalPrice));
}

if (placeOrderButton) {
    placeOrderButton.addEventListener('click', () => placeOrder(cart, products, checkoutShippingSelect));
}

const initApp = async () => {
    try {
        const response = await fetch(baseurl);
        if (!response.ok) {
            throw new Error('Failed to fetch products. Please try again later.');
        }
        const data = await response.json();
        products = data;
        addDataToHTML(products, listProductHTML, (id, size) => {
            cart = addToCart(cart, id, size, products, listCartHTML, iconCart, iconCartSpan);
        }, '../product/index.html?id=');

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
            updateCheckoutPage(cart, products, checkoutList, checkoutTotalQuantity, checkoutTotalPrice, calculateFinalTotal, removeFromCart, checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, listCartHTML, iconCartSpan);
        } else {
            cart = [];
            updateCheckoutPage(cart, products, checkoutList, checkoutTotalQuantity, checkoutTotalPrice, calculateFinalTotal, removeFromCart, checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, listCartHTML, iconCartSpan);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        displayMessage('Failed to load products. Please check your internet connection and try again.', 'error');
    }
};

window.addEventListener('DOMContentLoaded', initApp);