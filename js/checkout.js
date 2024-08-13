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
let products = [];
let cart = [];

// Ensure elements exist before adding event listeners
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

const getRandomProduct = () => {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
};

const addProductToCart = (productId, size = 'Undefined') => {
    console.log(`Adding product to cart: ${productId}, size: ${size}`);
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
    addCartToHTML();
    addCartToMemory();
    console.log('Cart after adding product:', cart);
};

const updateDetailWithRandomProduct = () => {
    const thisProduct = getRandomProduct();
    if (!thisProduct || !thisProduct.image) {
        console.error('Invalid product returned by getRandomProduct:', thisProduct);
        return;
    }

    const anchor = document.createElement('a');
    anchor.href = `product/index.html?id=${thisProduct.id}`;

    const img = document.createElement('img');
    img.src = `${thisProduct.image}`;

    anchor.appendChild(img);
};

const addDataToHTML = () => {
    if (products.length > 0) {
        if (listProductHTML) {
            listProductHTML.innerHTML = '';
            // Slice the products array to get only the first 8 products
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
                    <select class="sizeSelector">${sizesOptions}</select>
                    <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        } else {
            console.error('listProductHTML element not found');
        }
    }
};

if (listProductHTML) {
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.parentElement.dataset.id;
            let size = positionClick.parentElement.querySelector('.sizeSelector').value;
            addProductToCart(id_product, size);
        }
    });
} else {
    console.error('listProductHTML element not found');
}

const addCartToMemory = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to local storage:', localStorage.getItem('cart'));
    } catch (error) {
        console.error('Error saving cart to local storage:', error);
    }
};

const addCartToHTML = () => {
    console.log('Updating cart HTML');
    listCartHTML.innerHTML = '';
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
            if (!info || !info.image) {
                console.error('Invalid product info for cart item:', info);
                return;
            }
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}" alt="${info.title}">
            </div>
            <div class="title">
                ${info.title}
            </div>
            <div class="size">
                Size: ${item.size}
            </div>
            <div class="totalPrice">$${(info.price * item.quantity).toFixed(2)}</div>
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
    } else {
        // If the cart is empty, display "Cart is empty" message
        let emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-cart-message');
        emptyMessage.innerText = 'Cart is empty';
        listCartHTML.appendChild(emptyMessage);
    }
    
    iconCartSpan.innerText = totalQuantity;
    console.log('Cart HTML updated. Total quantity:', totalQuantity);
};


if (listCartHTML) {
    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let size = positionClick.parentElement.parentElement.dataset.size;
            let type = 'minus';
            if (positionClick.classList.contains('plus')) {
                type = 'plus';
            }
            changeQuantityCart(product_id, size, type);
        } else if (positionClick.classList.contains('removeItem')) {
            let product_id = positionClick.parentElement.dataset.id;
            let size = positionClick.parentElement.dataset.size;
            removeFromCart(product_id, size);
        }
    });
} else {
    console.error('listCartHTML element not found');
}

const changeQuantityCart = (product_id, size, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
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
    addCartToHTML();
    addCartToMemory();
    console.log('Cart after quantity change:', cart);
};

const removeFromCart = (product_id, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        cart.splice(positionItemInCart, 1);
    }
    addCartToHTML();
    addCartToMemory();
    updateCheckoutPage();
    console.log('Cart after removing product:', cart);
};

const checkoutShippingSelect = document.querySelector('#shipping');
const checkoutShippingCost = document.querySelector('.shippingCost');
const checkoutFinalTotal = document.querySelector('.finalTotal');

const calculateFinalTotal = () => {
    let shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
    let cartTotalPrice = parseFloat(checkoutTotalPrice.innerText.replace('$', ''));
    let finalTotal = cartTotalPrice + shippingCost;

    checkoutShippingCost.innerText = `$${shippingCost.toFixed(2)}`;
    checkoutFinalTotal.innerText = `$${finalTotal.toFixed(2)}`;
};

checkoutShippingSelect.addEventListener('change', calculateFinalTotal);

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
                let info = products[positionProduct];
                checkoutList.appendChild(newItem);
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
                totalPrice += info.price * item.quantity;
            });

            if (checkoutTotalQuantity) {
                checkoutTotalQuantity.innerText = totalQuantity;
            }
            if (checkoutTotalPrice) {
                checkoutTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
            }
            calculateFinalTotal(); // Calculate the final total after updating the prices

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

document.getElementById('placeOrder').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return; // Stop the function if the cart is empty
    }

    // Save the selected shipping cost
    const shippingCost = parseFloat(document.querySelector('#shipping').selectedOptions[0].dataset.price);
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
});

// Event listener for remove buttons on the checkout page
if (checkoutList) {
    checkoutList.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('removeItem')) {
            let product_id = positionClick.closest('.item').dataset.id;
            let size = positionClick.closest('.item').dataset.size;
            removeFromCart(product_id, size);
        }
    });
} else {
    console.error('checkoutList element not found');
}

// Event listener for remove buttons on the checkout page
if (checkoutList) {
    checkoutList.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('removeItem')) {
            let product_id = positionClick.parentElement.dataset.id;
            let size = positionClick.parentElement.dataset.size;
            removeFromCart(product_id, size);
        }
    });
} else {
    console.error('checkoutList element not found');
}

const saveCartAsReceipt = () => {
    localStorage.setItem('receipt', JSON.stringify(cart)); // Save the cart as a receipt
    localStorage.removeItem('cart'); // Clear the cart from local storage
    cart = []; // Clear the cart in memory
    addCartToHTML(); // Update the cart display
    updateCheckoutPage(); // Update the checkout page
    console.log('Cart saved as receipt and cleared.');
};

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

const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        const data = await response.json();
        products = data;
        addDataToHTML();
        updateDetailWithRandomProduct();

        const storedCart = localStorage.getItem('cart');
        console.log('Stored cart from local storage:', storedCart);
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML();
            updateCheckoutPage();
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

window.addEventListener('DOMContentLoaded', initApp);