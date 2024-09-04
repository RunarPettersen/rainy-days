import { fetchProducts, sortProductsByPrice, filterProductsByGender, getProductIdFromURL } from './utils/productData.js';
import { renderProductDetail, renderProductList } from './utils/renderProducts.js';
import { addToCart } from './utils/cartManager.js';
import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/message.js';
import { setActiveLink } from './utils/menu.js';
import { setupCartIcon } from './utils/cartIcon.js';
import { addCartToHTML } from './utils/cart.js';
import { baseurl } from './constants/api.js';

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
    sortProductsByPrice(products, sortPriceSelect.value);
    addDataToHTML();
});

genderFilterSelect.addEventListener('change', () => {
    addDataToHTML();
});

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
            renderProductDetail(product, myProductHTML, handleAddToCart);
        }
    } else {
        const filteredProducts = filterProductsByGender(products, selectedGender);
        productListTitle.style.display = 'block';
        sortPriceSelect.style.display = 'block';
        
        renderProductList(filteredProducts, myProductHTML, handleAddToCart);
    }
};

const handleAddToCart = (id, size) => {
    addToCart(cart, id, size, products, listCartHTML, iconCart, iconCartSpan);
};

const initApp = async () => {
    try {
        products = await fetchProducts(baseurl);
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