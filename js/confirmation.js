let receiptList = document.querySelector('.receipt-list');
let receiptTotalQuantity = document.querySelector('.totalQuantity');
let receiptTotalPrice = document.querySelector('.totalPrice');

// Function to display the receipt on the confirmation page
const displayReceipt = () => {
    // Retrieve the receipt from localStorage
    const receipt = JSON.parse(localStorage.getItem('receipt')) || [];
    console.log('Receipt:', receipt); // Log the receipt to check its content
    let totalQuantity = 0;
    let totalPrice = 0;

    if (receipt.length > 0) {
        receiptList.innerHTML = ''; // Clear the receipt list

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

        if (receiptTotalQuantity) {
            receiptTotalQuantity.innerText = totalQuantity;
        }
        if (receiptTotalPrice) {
            receiptTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
        }
    } else {
        receiptList.innerHTML = '<div class="empty-receipt-message">No items in receipt</div>';
    }
};

// Initialize the confirmation page
document.addEventListener('DOMContentLoaded', () => {
    displayReceipt();
});

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
    displayOrderNumber();
});

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    if (loader) {
        loader.classList.add("loader-hidden");

        loader.addEventListener("transitionend", () => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        });
    } else {
        console.error('Loader element not found');
    }
});
