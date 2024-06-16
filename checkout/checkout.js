let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let checkoutCartList = document.querySelector('.returnCart .list');
let totalQuantityHTML = document.querySelector('.totalQuantity');
let totalPriceHTML = document.querySelector('.totalPrice');
let listCart = [];
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
    console.log('Checked Cart:', listCart);
}

checkCart();
addCartToHTML();

function addCartToHTML() {
    console.log('Updating Cart HTML...');
    checkoutCartList.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (listCart.length > 0) {
        listCart.forEach(product => {
            if (product) {
                let newP = document.createElement('div');
                newP.classList.add('item');
                newP.innerHTML = `
                    <img src="../${product.image}" alt="">
                    <div class="info">
                        <div class="name">${product.title}</div>
                        <div class="price">$${product.price}</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">$${product.price * product.quantity}</div>`;
                checkoutCartList.appendChild(newP);
                totalQuantity += product.quantity;
                totalPrice += product.price * product.quantity;
            }
        });
    }
    totalQuantityHTML.innerHTML = totalQuantity;
    totalPriceHTML.innerText = '$' + totalPrice;

    console.log('Cart Updated:', { totalQuantity, totalPrice });
}

// Fetch product data and initialize the app
const initApp = () => {
    fetch('../products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            console.log('Products fetched:', products);
            addDataToHTML();
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                updateCartHTML();
            }
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

// Function to add product data to the HTML
const addDataToHTML = () => {
    const productId = getProductIdFromURL();
    if (products.length > 0) {
        myProductHTML.innerHTML = '';
        products.forEach(product => {
            if (!productId || product.id == productId) {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = `
                    <img src="../${product.image}" alt="">
                    <h2>${product.title}</h2>
                    <div class="description">${product.description}</div>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>`;
                myProductHTML.appendChild(newProduct);
            }
        });
        console.log('Added products to HTML:', myProductHTML.innerHTML);
    }
}

// Get product ID from the URL
const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Event listener for adding items to the cart
myProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
})

// Function to add items to the cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    console.log('Cart after adding product:', cart);
    updateCartHTML();
    saveCartToMemory();
}

// Function to save the cart to local storage
const saveCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update the cart in the DOM
const updateCartHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="../${info.image}">
            </div>
            <div class="title">
                ${info.title}
            </div>
            <div class="totalPrice">$${info.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>`;
            totalPrice += info.price * item.quantity;
        });

        let totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        totalDiv.innerHTML = `
        <h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
        listCartHTML.appendChild(totalDiv);
    }
    iconCartSpan.innerText = totalQuantity;
    console.log('Updated Cart HTML in listCart:', listCartHTML.innerHTML);
}

// Event listener for changing item quantities in the cart
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if (positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})

// Function to change item quantities in the cart
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    updateCartHTML();
    saveCartToMemory();
}

// Initialize the app
initApp();