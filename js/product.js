let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let productListTitle = document.querySelector('.title');
let sortPriceSelect = document.querySelector('#sortPrice');
let sortPriceTitle = document.querySelector('.sorting-controls');
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

if (sortPriceSelect) {
    sortPriceSelect.addEventListener('change', () => {
        sortProductsByPrice(sortPriceSelect.value);
        addDataToHTML();
    });
} else {
    console.error('sortPriceSelect element not found');
}

const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

const sortProductsByPrice = (order) => {
    products.sort((a, b) => {
        if (order === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
};

const addDataToHTML = () => {
    const productId = getProductIdFromURL();

    if (productId) {
        productListTitle.style.display = 'none';
        myProductHTML.style.display = 'none';
        sortPriceSelect.style.display = 'none';
        sortPriceTitle.style.display = 'none';

        const product = products.find(product => product.id == productId);
        if (product) {
            let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
            let productDetail = document.createElement('div');
            productDetail.classList.add('item');
            productDetail.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <div class="description">${product.description}</div>
                <div class="gender">Gender: ${product.gender}</div>
                <div class="gender">Color: ${product.baseColor}</div>
                <div class="price">$${product.price}</div>
                <select class="sizeSelector">${sizesOptions}</select>
                <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
            myProductHTML.appendChild(productDetail);
            myProductHTML.style.display = 'block';
        }
    } else {
        if (products.length > 1) {
            productListTitle.style.display = 'block';
            myProductHTML.innerHTML = '';
            sortPriceSelect.style.display = 'block'; // Show price sorter

            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                let sizesOptions = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');
                newProduct.innerHTML = `
                    <a href="index.html?id=${product.id}"><img src="${product.image}" alt="${product.title}"></a>
                    <h2>${product.title}</h2>
                    <div class="description">${product.description}</div>
                    <div class="price">$${product.price}</div>
                    <select class="sizeSelector">${sizesOptions}</select>
                    <button class="addCart" data-id="${product.id}">Add To Cart</button>`;
                myProductHTML.appendChild(newProduct);
            });
        } else {
            productListTitle.style.display = 'none';
            myProductHTML.style.display = 'none';
            sortPriceSelect.style.display = 'none'; // Hide price sorter
        }
    }
};

if (myProductHTML) {
    myProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.dataset.id;
            let size = positionClick.parentElement.querySelector('.sizeSelector').value;
            addToCart(id_product, size);
        }
    });
} else {
    console.error('myProductHTML element not found');
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