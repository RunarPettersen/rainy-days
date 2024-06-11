let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let detail = document.querySelector('.main-heading');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const getRandomProduct = () => {
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
};

const addProductToCart = (productId, size) => {
    if (!size) {
        size = 'Undefined'; // Default size if not defined
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
    addCartToHTML();
    addCartToMemory();
};

const updateDetailWithRandomProduct = () => {
    const thisProduct = getRandomProduct();

    if (!thisProduct || !thisProduct.image) {
        console.error('Invalid product returned by getRandomProduct:', thisProduct);
        return;
    }

    // Create the anchor element
    const anchor = document.createElement('a');
    anchor.href = `product/index.html?id=${thisProduct.id}`;

    // Create the image element
    const img = document.createElement('img');
    img.src = thisProduct.image;

    // Append the image to the anchor
    anchor.appendChild(img);

    // Replace the existing image with the new anchor-wrapped image
    const mainImageContainer = detail.querySelector('.main-image');
    mainImageContainer.innerHTML = ''; // Clear existing content
    mainImageContainer.appendChild(anchor);

    detail.querySelector('.main-title h1').innerText = thisProduct.title;
    detail.querySelector('.main-price').innerText = '$' + thisProduct.price;
    detail.querySelector('.main-description').innerText = thisProduct.description;

    // Populate size selector
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
    if (products.length > 0) {
        listProductHTML.innerHTML = '';
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            newProduct.innerHTML =
                `<a href="product/index.html?id=${product.id}"><img src="${product.image}" alt=""></a>
                <h2>${product.title}</h2>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector">${sizesOptions}</select>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        let size = positionClick.parentElement.querySelector('.sizeSelector').value;
        addProductToCart(id_product, size);
    }
});

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
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
                <img src="${info.image}">
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
};

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

const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            updateDetailWithRandomProduct();
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};
initApp();