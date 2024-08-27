let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let detail = document.querySelector('.main-heading');
let products = [];
let cart = [];

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
    img.src = thisProduct.image;
    img.alt = thisProduct.title;

    anchor.appendChild(img);

    const mainImageContainer = detail.querySelector('.main-image');
    mainImageContainer.innerHTML = '';
    mainImageContainer.appendChild(anchor);

    // Generate a unique suffix for the id
    const uniqueSuffix = `${thisProduct.id}-${Date.now()}`;

    // Adding id attributes for title, price, and description
    const titleElement = detail.querySelector('.main-title h1');
    titleElement.id = `product-title-${uniqueSuffix}`;
    titleElement.innerText = thisProduct.title;

    const priceElement = detail.querySelector('.main-price');
    priceElement.id = `product-price-${uniqueSuffix}`;
    priceElement.innerText = '$' + thisProduct.price.toFixed(2);

    const descriptionElement = detail.querySelector('.main-description');
    descriptionElement.id = `product-description-${uniqueSuffix}`;
    descriptionElement.innerText = thisProduct.description;

    // Select size selector and ensure it has both an id and a name attribute
    const sizeSelector = detail.querySelector('.sizeSelector');
    sizeSelector.id = `sizeSelector-${uniqueSuffix}`;   // Ensure unique ID
    sizeSelector.name = `size-${thisProduct.id}`;       // Ensure unique name

    // Populate the size options
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
    if (products.length > 0) {
        listProductHTML.innerHTML = '';
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            const uniqueId = `sizeSelector-${product.id}-${Date.now()}`;
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            newProduct.innerHTML =
                `<a href="product/index.html?id=${product.id}"><img src="${product.image}" alt="${product.title}"></a>
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector" aria-label="Size selector" id="${uniqueId}" name="size-${product.id}">${sizesOptions}</select>
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
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach((item, index) => {
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
            <div class="quantity ${index % 2 === 0 ? 'odd' : 'even'}">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>`;
            totalPrice += info.price * item.quantity;
        });

        let totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        totalDiv.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
        listCartHTML.appendChild(totalDiv);
    } else {
        let emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-cart-message');
        emptyMessage.innerText = 'Cart is empty';
        listCartHTML.appendChild(emptyMessage);
    }
    iconCartSpan.innerText = totalQuantity;
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
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML();
        }
    } catch (error) {
        alert('Error fetching products:', error);
    }
};

document.addEventListener('DOMContentLoaded', initApp);