let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let detail = document.querySelector('.main-heading');
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

const addProductToCart = (productId, size) => {
    console.log(`Adding product to cart: ${productId}, size: ${size}`);
    if (!size) {
        size = 'Undefined';
    }

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
    console.log('Cart after adding product:', cart);
    addCartToHTML();
    addCartToMemory();
};

const updateDetailWithRandomProduct = () => {
    const thisProduct = getRandomProduct();
    console.log('Updating detail with random product:', thisProduct);

    if (!thisProduct || !thisProduct.image) {
        console.error('Invalid product returned by getRandomProduct:', thisProduct);
        return;
    }

    const anchor = document.createElement('a');
    anchor.href = `product/index.html?id=${thisProduct.id}`;

    const img = document.createElement('img');
    img.src = thisProduct.image;

    anchor.appendChild(img);

    const mainImageContainer = detail.querySelector('.main-image');
    mainImageContainer.innerHTML = '';
    mainImageContainer.appendChild(anchor);

    detail.querySelector('.main-title h1').innerText = thisProduct.title;
    detail.querySelector('.main-price').innerText = '$' + thisProduct.price.toFixed(2);
    detail.querySelector('.main-description').innerText = thisProduct.description;

    const sizeSelector = detail.querySelector('.sizeSelector');
    sizeSelector.innerHTML = thisProduct.sizes.map(size => `<option value="${size}">${size}</option>`).join('');

    const addCartButton = detail.querySelector('.addCart');
    addCartButton.dataset.id = thisProduct.id;

    const newAddToCartHandler = () => {
        const selectedSize = sizeSelector.value;
        addProductToCart(thisProduct.id, selectedSize);
    };

    if (addCartButton._addToCartHandler) {
        addCartButton.removeEventListener('click', addCartButton._addToCartHandler);
    }
    addCartButton.addEventListener('click', newAddToCartHandler);
    addCartButton._addToCartHandler = newAddToCartHandler;
};

const addDataToHTML = () => {
    console.log('Adding data to HTML');
    if (products.length > 0) {
        listProductHTML.innerHTML = '';
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            newProduct.innerHTML =
                `<a href="product/index.html?id=${product.id}"><img src="${product.image}" alt="${product.title}"></a>
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector">${sizesOptions}</select>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    } else {
        console.error('No products available');
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
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to local storage:', localStorage.getItem('cart'));
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
                <img src="${info.image}">
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
        }
    });
} else {
    console.error('listCartHTML element not found');
}

const changeQuantityCart = (product_id, size, type) => {
    console.log(`Changing quantity of product in cart: ${product_id}, size: ${size}, type: ${type}`);
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
    console.log('Cart after changing quantity:', cart);
    addCartToHTML();
    addCartToMemory();
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
        console.log('Products fetched:', products);
        addDataToHTML();
        updateDetailWithRandomProduct();

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML();
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);