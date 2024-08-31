import { setupLoader } from './assets/loader.js';

setupLoader();

let receiptList = document.querySelector('.receipt-list');
let receiptTotalQuantity = document.querySelector('.totalQuantity');
let receiptTotalPrice = document.querySelector('.totalPrice');
let receiptShippingCost = document.querySelector('.shippingCost');
let receiptFinalTotal = document.querySelector('.finalTotal');

const displayReceipt = () => {
    const receipt = JSON.parse(localStorage.getItem('receipt')) || [];
    const shippingCost = parseFloat(localStorage.getItem('shippingCost')) || 0.00;
    console.log('Receipt:', receipt);
    let totalQuantity = 0;
    let totalPrice = 0;

    if (receipt.length > 0) {
        receiptList.innerHTML = '';

        receipt.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.dataset.size = item.size;

            newItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="info">
                    <div class="name">${item.title}</div>
                    <div class="size">Size: ${item.size}</div>
                </div>
                <div class="quantity">${item.quantity}</div>
                <div class="sidepanel">
                    <div class="returnPrice">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>`;
            receiptList.appendChild(newItem);
            totalPrice += item.price * item.quantity;
        });

        // Update the receipt totals
        if (receiptTotalQuantity) {
            receiptTotalQuantity.innerText = totalQuantity;
        }
        if (receiptTotalPrice) {
            receiptTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
        }
        if (receiptShippingCost) {
            receiptShippingCost.innerText = `$${shippingCost.toFixed(2)}`;
        }
        if (receiptFinalTotal) {
            let finalTotal = totalPrice + shippingCost;
            receiptFinalTotal.innerText = `$${finalTotal.toFixed(2)}`;
        }
    } else {
        receiptList.innerHTML = '<div class="empty-receipt-message">No items in receipt</div>';
    }
};

// Function to generate the order number
function generateOrderNumber() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    return `ORD-${timestamp}-${randomNum}`;
}

// Function to display the order number on the confirmation page
function displayOrderNumber() {
    const orderNumberElement = document.querySelector('.order-number');
    const orderNumber = generateOrderNumber();
    orderNumberElement.innerText = `Order number: ${orderNumber}`;
    
    // Optionally, store the order number in localStorage
    localStorage.setItem('orderNumber', orderNumber);
}

// Initialize the confirmation page
document.addEventListener('DOMContentLoaded', () => {
    displayReceipt();
    displayOrderNumber();
});