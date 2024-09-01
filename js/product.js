import { addCartToHTML, changeQuantityCart } from './assets/cart.js';
import { setupLoader } from './assets/loader.js';
import { displayMessage } from './assets/message.js';
import { setActiveLink } from './assets/menu.js';
import { setupCartIcon } from './assets/cartIcon.js';

setupLoader();
setActiveLink();
setupCartIcon();

let myProductHTML = document.querySelector('.myProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let productListTitle = document.querySelector('.title');
let sortPriceSelect = document.querySelector('#sortPrice');
let sortPriceTitle = document.querySelector('.sorting-controls');
let genderControls = document.querySelector('.gender-controls');
let genderFilterSelect = document.querySelector('#genderFilter');
let products = [];
let cart = [];

sortPriceSelect.addEventListener('change', () => {
    sortProductsByPrice(sortPriceSelect.value);
    addDataToHTML();
});

genderFilterSelect.addEventListener('change', () => {
    addDataToHTML();
});

const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

const sortProductsByPrice = (order) => {
    products.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
};

const addDataToHTML = () => {
    const productId = getProductIdFromURL();
    const selectedGender = genderFilterSelect.value;

    if (productId) {
        productListTitle.style.display = 'none';
        myProductHTML.style.display = 'none';
        sortPriceSelect.style.display = 'none';
        sortPriceTitle.style.display = 'none';
        genderFilterSelect.style.display = 'none';
        genderControls.style.display = 'none';

        const product = products.find(product => product.id == productId);
        if (product) {
            const productDetail = document.createElement('div');
            productDetail.classList.add('item');

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            productDetail.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = product.title;
            productDetail.appendChild(title);

            const description = document.createElement('div');
            description.classList.add('description');
            description.textContent = product.description;
            productDetail.appendChild(description);

            const gender = document.createElement('div');
            gender.classList.add('gender');
            gender.textContent = `Gender: ${product.gender}`;
            productDetail.appendChild(gender);

            const color = document.createElement('div');
            color.classList.add('gender');
            color.textContent = `Color: ${product.baseColor}`;
            productDetail.appendChild(color);

            const price = document.createElement('div');
            price.classList.add('price');
            price.textContent = `$${product.price}`;
            productDetail.appendChild(price);

            const select = document.createElement('select');
            select.classList.add('sizeSelector');
            select.id = product.title;
            select.name = product.title;
            product.sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                select.appendChild(option);
            });
            productDetail.appendChild(select);

            const button = document.createElement('button');
            button.classList.add('addCart');
            button.dataset.id = product.id;
            button.textContent = 'Add To Cart';
            productDetail.appendChild(button);

            myProductHTML.appendChild(productDetail);
            myProductHTML.style.display = 'block';
        }
    } else {
        let filteredProducts = products;
        if (selectedGender !== 'all') {
            filteredProducts = products.filter(product => product.gender.toLowerCase() === selectedGender);
        }

        if (filteredProducts.length > 1) {
            productListTitle.style.display = 'block';
            myProductHTML.innerHTML = '';
            sortPriceSelect.style.display = 'block';

            filteredProducts.forEach(product => {
                const newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');

                const anchor = document.createElement('a');
                anchor.href = `index.html?id=${product.id}`;
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.title;
                anchor.appendChild(img);
                newProduct.appendChild(anchor);

                const title = document.createElement('h2');
                title.textContent = product.title;
                newProduct.appendChild(title);

                const description = document.createElement('div');
                description.classList.add('description');
                description.textContent = product.description;
                newProduct.appendChild(description);

                const price = document.createElement('div');
                price.classList.add('price');
                price.textContent = `$${product.price}`;
                newProduct.appendChild(price);

                const select = document.createElement('select');
                select.classList.add('sizeSelector');
                select.id = product.title;
                select.name = product.title;
                product.sizes.forEach(size => {
                    const option = document.createElement('option');
                    option.value = size;
                    option.textContent = size;
                    select.appendChild(option);
                });
                newProduct.appendChild(select);

                const button = document.createElement('button');
                button.classList.add('addCart');
                button.dataset.id = product.id;
                button.textContent = 'Add To Cart';
                newProduct.appendChild(button);

                myProductHTML.appendChild(newProduct);
            });
        } else {
            productListTitle.style.display = 'none';
            myProductHTML.style.display = 'none';
            sortPriceSelect.style.display = 'none';
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
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    addCartToMemory();
    triggerShakeAnimation(iconCart);
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const triggerShakeAnimation = (element) => {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
};

const initApp = async () => {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        if (!response.ok) {
            throw new Error('Failed to fetch products. Please try again later.');
        }
        const data = await response.json();
        products = data;
        addDataToHTML();

        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        displayMessage('Failed to load products. Please check your internet connection and try again.', 'error');
    }
};

document.addEventListener('DOMContentLoaded', initApp);