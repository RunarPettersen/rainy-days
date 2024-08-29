import { addCartToHTML, changeQuantityCart } from './cart.js';
import { setupLoader } from './loader.js';

setupLoader();

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let detail = document.querySelector('.main-heading');
let checkoutList = document.querySelector('.list');
let checkoutTotalQuantity = document.querySelector('.totalQuantity');
let checkoutTotalPrice = document.querySelector('.totalPrice');
let checkoutShippingSelect = document.querySelector('#shipping');
let checkoutShippingCost = document.querySelector('.shippingCost');
let checkoutFinalTotal = document.querySelector('.finalTotal');
let placeOrderButton = document.getElementById('placeOrder'); // Ensure this is correctly referenced
let products = [];
let cart = [];

// Event listeners for cart toggling
if (iconCart) {
    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
} else {
    console.error('iconCart element not found');
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
} else {
    console.error('closeCart element not found');
}

// Function to fetch and display products in HTML
const addDataToHTML = () => {
    if (products.length > 0 && listProductHTML) {
        listProductHTML.innerHTML = '';
        const productsToShow = products.slice(0, 8);
        productsToShow.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            newProduct.innerHTML =
                `<a href="../product/index.html?id=${product.id}"><img src="${product.image}" alt="${product.title}"></a>
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector" id="${product.title}" name="${product.title}">${sizesOptions}</select>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        console.error('listProductHTML element not found');
    }
};

// Event listener for adding products to cart
if (listProductHTML) {
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.parentElement.dataset.id;
            let size = positionClick.parentElement.querySelector('.sizeSelector').value;
            addToCart(id_product, size);
        }
    });
} else {
    console.error('listProductHTML element not found');
}

// Function to add a product to the cart
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
    console.log('Cart after adding item:', cart); // Debugging line
    addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Use the imported function
    addCartToMemory();
};

// Function to save cart to localStorage
const addCartToMemory = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to local storage:', JSON.parse(localStorage.getItem('cart'))); // Debugging line
    } catch (error) {
        console.error('Error saving cart to local storage:', error);
    }
};

// Function to update the checkout page display
const updateCheckoutPage = () => {
    if (checkoutList) {
        checkoutList.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                newItem.dataset.size = item.size;
                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                if (positionProduct === -1) {
                    console.error('Product not found for cart item:', item);
                    return;
                }
                let info = products[positionProduct];
                newItem.innerHTML = `
                <img src="${info.image}" alt="${info.title}">
                <div class="info">
                    <div class="name">${info.title}</div>
                    <div class="size">${item.size}</div>
                    <div class="price">$${info.price} / ${item.quantity} product(s)</div>
                </div>
                <div class="quantity">${item.quantity}</div>
                <div class="sidepanel">
                    <div class="returnPrice">$${(info.price * item.quantity).toFixed(2)}</div>
                    <button class="removeItem">Remove</button>
                </div>`;
                checkoutList.appendChild(newItem);
                totalPrice += info.price * item.quantity;
            });

            if (checkoutTotalQuantity) {
                checkoutTotalQuantity.innerText = totalQuantity;
            }
            if (checkoutTotalPrice) {
                checkoutTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
            }
            calculateFinalTotal(); // Recalculate total including shipping

        } else {
            let emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-cart-message');
            emptyMessage.innerText = 'No items in cart';
            checkoutList.appendChild(emptyMessage);
        }
    } else {
        console.error('checkoutList element not found');
    }
};

// Function to calculate the final total including shipping cost
const calculateFinalTotal = () => {
    if (checkoutShippingSelect && checkoutShippingCost && checkoutFinalTotal) {
        let shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
        let cartTotalPrice = parseFloat(checkoutTotalPrice.innerText.replace('$', ''));
        let finalTotal = cartTotalPrice + shippingCost;

        checkoutShippingCost.innerText = `$${shippingCost.toFixed(2)}`;
        checkoutFinalTotal.innerText = `$${finalTotal.toFixed(2)}`;
        console.log('Final total calculated:', finalTotal); // Debugging line
    } else {
        console.error('Shipping or total elements not found');
    }
};

// Event listener for shipping selection change
if (checkoutShippingSelect) {
    checkoutShippingSelect.addEventListener('change', calculateFinalTotal);
} else {
    console.error('checkoutShippingSelect element not found');
}

// Function to handle placing an order
const placeOrder = () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    // Save the selected shipping cost
    const shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
    localStorage.setItem('shippingCost', shippingCost);

    // Save the current cart as a receipt
    const receipt = cart.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
            product_id: item.product_id,
            size: item.size,
            quantity: item.quantity,
            title: product.title,
            image: product.image,
            price: product.price
        };
    });
    localStorage.setItem('receipt', JSON.stringify(receipt));

    // Clear the cart
    localStorage.removeItem('cart');
    window.location.href = 'confirmation/index.html';
};

// Event listener for the Place Order button
if (placeOrderButton) {
    placeOrderButton.addEventListener('click', placeOrder);
} else {
    console.error('Place order button not found');
}

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

// Initialize the application and fetch products
const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        const data = await response.json();
        products = data;
        addDataToHTML();

        // Retrieve the cart from local storage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            console.log('Loaded cart from local storage:', cart); // Debugging line
            addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Use the imported function
            updateCheckoutPage(); // Update checkout display
        } else {
            cart = [];
            updateCheckoutPage(); // Display empty state
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

window.addEventListener('DOMContentLoaded', initApp);