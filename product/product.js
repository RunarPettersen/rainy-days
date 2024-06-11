let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let productListTitle = document.querySelector('.title'); // Assuming the product list title has class 'title'
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

const addDataToHTML = () => {
    const productId = getProductIdFromURL();

    if (productId) {
        // If a specific product ID is present in the URL, hide the product list title and container
        productListTitle.style.display = 'none';
        myProductHTML.style.display = 'none';

        // Find and display the specific product
        const product = products.find(product => product.id == productId);
        if (product) {
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            let productDetail = document.createElement('div');
            productDetail.classList.add('item');
            productDetail.innerHTML = `
                <img src="../${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="description">${product.description}</div>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector">${sizesOptions}</select>
                <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
            myProductHTML.appendChild(productDetail);
            myProductHTML.style.display = 'block'; // Ensure the specific product is displayed
        }
    } else {
        // If no specific product ID is present in the URL, display the product list
        if (products.length > 1) {
            productListTitle.style.display = 'block'; // Show the title
            myProductHTML.style.display = 'block';   // Show the product list container
            myProductHTML.innerHTML = '';
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
                newProduct.innerHTML = `
                    <img src="../${product.image}" alt="">
                    <h2>${product.title}</h2>
                    <div class="description">${product.description}</div>
                    <div class="price">$${product.price}</div>
                    <select class="sizeSelector">${sizesOptions}</select>
                    <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
                myProductHTML.appendChild(newProduct);
            });
        } else {
            productListTitle.style.display = 'none'; // Hide the title
            myProductHTML.style.display = 'none';   // Hide the product list container
        }
    }
};

myProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.dataset.id;
        let size = positionClick.parentElement.querySelector('.sizeSelector').value;
        addToCart(id_product, size);
    }
});

const addToCart = (product_id, size) => {
    if (!size) {
        size = 'Undefined'; // Default size if not defined
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
    addCartToHTML();
    addCartToMemory();
};

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
    fetch('../products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();