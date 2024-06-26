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
    img.src = `../${thisProduct.image}`;

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
                    `<a href="product/index.html?id=${product.id}"><img src="../${product.image}" alt=""></a>
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
    if (listCartHTML) {
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
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                    <img src="../${info.image}">
                </div>
                <div class="title">
                    ${info.title}
                </div>
                <div class="size">
                    Size: ${item.size}
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
        console.log('Updated cart HTML. Total quantity:', totalQuantity);
    } else {
        console.error('listCartHTML element not found');
    }
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
                <img src="../${info.image}">
                <div class="info">
                    <div class="name">${info.title}</div>
                    <div class="size">${item.size}</div>
                    <div class="price">$${info.price} / ${item.quantity} product(s)</div>
                </div>
                <div class="quantity">${item.quantity}</div>
                <div class="returnPrice">$${(info.price * item.quantity).toFixed(2)}</div>`;
                totalPrice += info.price * item.quantity;
            });
        }
        if (checkoutTotalQuantity) {
            checkoutTotalQuantity.innerText = totalQuantity;
        } else {
            console.error('checkoutTotalQuantity element not found');
        }
        if (checkoutTotalPrice) {
            checkoutTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
        } else {
            console.error('checkoutTotalPrice element not found');
        }
    } else {
        console.error('checkoutList element not found');
    }
};

const initApp = () => {
    fetch('../js/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            updateDetailWithRandomProduct();
            try {
                const storedCart = localStorage.getItem('cart');
                console.log('Stored cart from local storage:', storedCart);
                if (storedCart) {
                    cart = JSON.parse(storedCart);
                    addCartToHTML();
                    updateCheckoutPage();
                }
            } catch (error) {
                console.error('Error retrieving cart from local storage:', error);
            }
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
};

document.addEventListener('DOMContentLoaded', initApp);