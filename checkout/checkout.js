let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
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
}

const addDataToHTML = () => {
    const productId = getProductIdFromURL();
    if (products.length > 0) {
        myProductHTML.innerHTML = '';
        products.forEach(product => {
            if (!productId || product.id == productId) {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML =
                    `<img src="../${product.image}" alt="">
                <h2>${product.title}</h2>
                <div class="description">${product.description}</div>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                myProductHTML.appendChild(newProduct);
            }
        });
    }
}

myProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
})

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
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity = totalQuantity + item.quantity;
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
}

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

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
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
}

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
        })
}
initApp();