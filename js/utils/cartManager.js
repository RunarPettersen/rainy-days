import { addCartToHTML } from './cart.js';
import { triggerShakeAnimation } from './cartIcon.js';
import { displayMessage } from './message.js';

export const addToCart = (cart, product_id, size, products, listCartHTML, iconCart, iconCartSpan) => {
    if (!Array.isArray(cart) || !Array.isArray(products)) {
        console.error('Cart or products array is not defined correctly.');
        return cart;
    }

    const product = products.find(p => p.id == product_id);
    if (!product) {
        console.error(`Product with ID ${product_id} not found.`);
        return cart;
    }

    if (!size) {
        size = 'Undefined';
    }

    let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id && value.size == size);
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
    saveCartToMemory(cart);

    if (iconCart) {
        triggerShakeAnimation(iconCart);
    }
    displayMessage('Item added to cart', 'success');

    return cart;
};

export const removeFromCart = (cart, product_id, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        cart.splice(positionItemInCart, 1);
    }
    return cart;
};

export const saveCartToMemory = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to local storage:', error);
    }
};

export const updateCartUI = (cart, products, listCartHTML, iconCart, iconCartSpan) => {
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    saveCartToMemory(cart);
    if (iconCart) {
        triggerShakeAnimation(iconCart);
    }
    displayMessage('Item added to cart', 'success');
};