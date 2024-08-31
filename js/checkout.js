import { addCartToHTML, changeQuantityCart } from './assets/cart.js';
import { setupLoader } from './assets/loader.js';
import { displayMessage } from './assets/message.js';

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
let placeOrderButton = document.getElementById('placeOrder');
let products = [];
let cart = [];

if (iconCart) {
    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
}

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
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    addCartToMemory();
    triggerShakeAnimation(iconCart);
};

const addCartToMemory = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to local storage:', error);
    }
};

const triggerShakeAnimation = (element) => {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
};

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

                let positionProduct = products.findIndex(value => value.id == item.product_id);
                if (positionProduct === -1) {
                    console.error('Product not found for cart item:', item);
                    return;
                }
                let info = products[positionProduct];

                let img = document.createElement('img');
                img.src = info.image;
                img.alt = info.title;

                let infoDiv = document.createElement('div');
                infoDiv.classList.add('info');

                let nameDiv = document.createElement('div');
                nameDiv.classList.add('name');
                nameDiv.textContent = info.title;

                let sizeDiv = document.createElement('div');
                sizeDiv.classList.add('size');
                sizeDiv.textContent = `Size: ${item.size}`;

                let priceDiv = document.createElement('div');
                priceDiv.classList.add('price');
                priceDiv.textContent = `$${info.price} / ${item.quantity} product(s)`;

                infoDiv.appendChild(nameDiv);
                infoDiv.appendChild(sizeDiv);
                infoDiv.appendChild(priceDiv);

                let quantityDiv = document.createElement('div');
                quantityDiv.classList.add('quantity');
                quantityDiv.textContent = item.quantity;

                let sidePanel = document.createElement('div');
                sidePanel.classList.add('sidepanel');

                let returnPriceDiv = document.createElement('div');
                returnPriceDiv.classList.add('returnPrice');
                returnPriceDiv.textContent = `$${(info.price * item.quantity).toFixed(2)}`;

                let removeButton = document.createElement('button');
                removeButton.classList.add('removeItem');
                removeButton.textContent = 'Remove';

                removeButton.addEventListener('click', () => {
                    removeFromCart(item.product_id, item.size);
                });

                sidePanel.appendChild(returnPriceDiv);
                sidePanel.appendChild(removeButton);

                newItem.appendChild(img);
                newItem.appendChild(infoDiv);
                newItem.appendChild(quantityDiv);
                newItem.appendChild(sidePanel);

                checkoutList.appendChild(newItem);

                totalPrice += info.price * item.quantity;
            });

            if (checkoutTotalQuantity) {
                checkoutTotalQuantity.innerText = totalQuantity;
            }
            if (checkoutTotalPrice) {
                checkoutTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
            }
            calculateFinalTotal();

        } else {
            let emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-cart-message');
            emptyMessage.innerText = 'No items in cart';
            checkoutList.appendChild(emptyMessage);
        }
    }
};

const calculateFinalTotal = () => {
    if (checkoutShippingSelect && checkoutShippingCost && checkoutFinalTotal) {
        let shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
        let cartTotalPrice = parseFloat(checkoutTotalPrice.innerText.replace('$', ''));
        let finalTotal = cartTotalPrice + shippingCost;

        checkoutShippingCost.innerText = `$${shippingCost.toFixed(2)}`;
        checkoutFinalTotal.innerText = `$${finalTotal.toFixed(2)}`;
    }
};

if (checkoutShippingSelect) {
    checkoutShippingSelect.addEventListener('change', calculateFinalTotal);
}

const placeOrder = () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
    localStorage.setItem('shippingCost', shippingCost);

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

    localStorage.removeItem('cart');
    window.location.href = 'confirmation/index.html';
};

if (placeOrderButton) {
    placeOrderButton.addEventListener('click', placeOrder);
}

const removeFromCart = (product_id, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        cart.splice(positionItemInCart, 1);
    }
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    addCartToMemory();
    updateCheckoutPage();
};

const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        if (!response.ok) {
            throw new Error('Failed to fetch products. Please try again later.');
        }
        const data = await response.json();
        products = data;
        addDataToHTML();

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
            updateCheckoutPage();
        } else {
            cart = [];
            updateCheckoutPage();
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        displayMessage('Failed to load products. Please check your internet connection and try again.', 'error');
    }
};

window.addEventListener('DOMContentLoaded', initApp);