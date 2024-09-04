import { setupLoader } from './utils/loader.js';
import { setupCartIcon } from './utils/cartIcon.js';
import { displayReceipt } from './utils/displayReceipt.js';

setupLoader();
setupCartIcon();

let receiptList = document.querySelector('.receipt-list');
let receiptTotalQuantity = document.querySelector('.totalQuantity');
let receiptTotalPrice = document.querySelector('.totalPrice');
let receiptShippingCost = document.querySelector('.shippingCost');
let receiptFinalTotal = document.querySelector('.finalTotal');

function generateOrderNumber() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    return `ORD-${timestamp}-${randomNum}`;
}

function displayOrderNumber() {
    const orderNumberElement = document.querySelector('.order-number');
    const orderNumber = generateOrderNumber();
    orderNumberElement.innerText = `Order number: ${orderNumber}`;
    
    localStorage.setItem('orderNumber', orderNumber);
}

document.addEventListener('DOMContentLoaded', () => {
    displayReceipt(receiptList, receiptTotalQuantity, receiptTotalPrice, receiptShippingCost, receiptFinalTotal);
    displayOrderNumber();
});