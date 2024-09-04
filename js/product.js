import { fetchProducts, sortProductsByPrice, filterProductsByGender, getProductIdFromURL } from './utils/productData.js';
import { renderProductDetail, renderProductList } from './utils/renderProducts.js';
import { addToCart } from './utils/cartManager.js';
import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/message.js';
import { setActiveLink } from './utils/menu.js';
import { setupCartIcon } from './utils/cartIcon.js';
import { addCartToHTML } from './utils/cart.js';

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

// Handle sorting and filtering
sortPriceSelect.addEventListener('change', () => {
    sortProductsByPrice(products, sortPriceSelect.value);
    addDataToHTML();
});

genderFilterSelect.addEventListener('change', () => {
    addDataToHTML();
});

// Function to add data to HTML based on current view
const addDataToHTML = () => {
    const productId = getProductIdFromURL();
    const selectedGender = genderFilterSelect.value;

    if (productId) {
        // Render product details for a specific product
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
        // Render list of products
        const filteredProducts = filterProductsByGender(products, selectedGender);
        productListTitle.style.display = 'block';
        sortPriceSelect.style.display = 'block';
        
        renderProductList(filteredProducts, myProductHTML, handleAddToCart);
    }
};

// Wrapper function for adding to cart to ensure correct parameters and scope
const handleAddToCart = (id, size) => {
    console.log(`Adding product to cart: ID=${id}, Size=${size}`); // Debugging line
    addToCart(cart, id, size, products, listCartHTML, iconCart, iconCartSpan);
};

// Initialize the app
const initApp = async () => {
    try {
        products = await fetchProducts('https://api.noroff.dev/api/v1/rainy-days');
        console.log('Fetched products:', products); // Debugging line
        addDataToHTML(); // Render products after fetching data

        // Load cart from local storage if available
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            addCartToHTML(cart, products, listCartHTML, iconCartSpan);
        }
    } catch (error) {
        console.error('Error fetching products:', error); // Debugging line
        displayMessage('Failed to load products. Please check your internet connection and try again.', 'error');
    }
};

document.addEventListener('DOMContentLoaded', initApp);