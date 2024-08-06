let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

// Check if the elements exist before adding event listeners
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
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    if (!listCartHTML) {
        console.error('listCartHTML element not found');
        return;
    }

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