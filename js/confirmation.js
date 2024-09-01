import { setupLoader } from './assets/loader.js';
import { addCartToHTML, changeQuantityCart } from './assets/cart.js';
import { setupCartIcon } from './assets/cartIcon.js';

setupLoader();
setupCartIcon();

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

            let img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;

            let infoDiv = document.createElement('div');
            infoDiv.classList.add('info');

            let nameDiv = document.createElement('div');
            nameDiv.classList.add('name');
            nameDiv.textContent = item.title;

            let sizeDiv = document.createElement('div');
            sizeDiv.classList.add('size');
            sizeDiv.textContent = `Size: ${item.size}`;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(sizeDiv);

            let quantityDiv = document.createElement('div');
            quantityDiv.classList.add('quantity');
            quantityDiv.textContent = item.quantity;

            let sidePanelDiv = document.createElement('div');
            sidePanelDiv.classList.add('sidepanel');

            let returnPriceDiv = document.createElement('div');
            returnPriceDiv.classList.add('returnPrice');
            returnPriceDiv.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            sidePanelDiv.appendChild(returnPriceDiv);

            newItem.appendChild(img);
            newItem.appendChild(infoDiv);
            newItem.appendChild(quantityDiv);
            newItem.appendChild(sidePanelDiv);

            receiptList.appendChild(newItem);

            totalPrice += item.price * item.quantity;
        });

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
        let emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-receipt-message');
        emptyMessage.textContent = 'No items in receipt';
        receiptList.appendChild(emptyMessage);
    }
};

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
    displayReceipt();
    displayOrderNumber();
});