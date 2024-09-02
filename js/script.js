import { addCartToHTML, changeQuantityCart } from './assets/cart.js';
import { setupLoader } from './assets/loader.js';
import { displayMessage } from './assets/message.js';
import { setActiveLink } from './assets/menu.js';
import { setupCartIcon } from './assets/cartIcon.js';

setupLoader();
setActiveLink();
setupCartIcon();

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let detail = document.querySelector('.main-heading');
let products = [];
let cart = [];

const getRandomProduct = () => {
    if (products.length === 0) {
        console.error('No products available to select randomly.');
        return null;
    }
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
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    addCartToMemory();
    triggerShakeAnimation(iconCart);
    displayMessage('Item added to cart', 'success');
};

const triggerShakeAnimation = (element) => {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
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

    const uniqueSuffix = `${thisProduct.id}-${Date.now()}`;

    const titleElement = detail.querySelector('.main-title h1');
    titleElement.id = `product-title-${uniqueSuffix}`;
    titleElement.innerText = thisProduct.title;

    const priceElement = detail.querySelector('.main-price');
    priceElement.id = `product-price-${uniqueSuffix}`;
    priceElement.innerText = '$' + thisProduct.price.toFixed(2);

    const descriptionElement = detail.querySelector('.main-description');
    descriptionElement.id = `product-description-${uniqueSuffix}`;
    descriptionElement.innerText = thisProduct.description;

    const sizeSelector = detail.querySelector('.sizeSelector');
    sizeSelector.id = `sizeSelector-${uniqueSuffix}`;
    sizeSelector.name = `size-${thisProduct.id}`;

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

const setupPopularProductsListeners = () => {
    const addCartButtons = document.querySelectorAll('.listProduct .addCart');
    
    addCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const id_product = event.target.closest('.item').dataset.id;
            const size = event.target.closest('.item').querySelector('.sizeSelector').value;
            addProductToCart(id_product, size);
        });
    });
};

const addDataToHTML = () => {
    if (products.length > 0) {
        listProductHTML.innerHTML = '';
        products.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');

            const anchor = document.createElement('a');
            anchor.href = `product/index.html?id=${product.id}`;

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            anchor.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = product.title;

            const price = document.createElement('div');
            price.classList.add('price');
            price.textContent = `$${product.price}`;

            const select = document.createElement('select');
            select.classList.add('sizeSelector');
            select.setAttribute('aria-label', 'Size selector');
            select.id = `sizeSelector-${product.id}-${Date.now()}`;
            select.name = `size-${product.id}`;
            product.sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                select.appendChild(option);
            });

            const button = document.createElement('button');
            button.classList.add('addCart');
            button.textContent = 'Add To Cart';

            newProduct.appendChild(anchor);
            newProduct.appendChild(title);
            newProduct.appendChild(price);
            newProduct.appendChild(select);
            newProduct.appendChild(button);

            listProductHTML.appendChild(newProduct);
        });

        setupPopularProductsListeners();
    } else {
        console.error('No products available');
    }
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
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
        updateDetailWithRandomProduct();

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