import { addCartToHTML } from './cart.js';
import { triggerShakeAnimation } from './cartIcon.js';
import { displayMessage } from './message.js';

export const addToCart = (cart, product_id, size, products, listCartHTML, iconCart, iconCartSpan) => {
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
    
    console.log('Updated cart:', cart); // Debugging line
    addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Ensure this is called
    saveCartToMemory(cart);
    triggerShakeAnimation(iconCart);
    displayMessage('Item added to cart', 'success');
};

// Function to remove a product from the cart
export const removeFromCart = (cart, product_id, size) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        cart.splice(positionItemInCart, 1);
    }
    return cart; // Return the updated cart
};

export const saveCartToMemory = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to local storage:', cart); // Optional: Debugging line
    } catch (error) {
        console.error('Error saving cart to local storage:', error);
    }
};

// UI Updates and Notification Actions
export const updateCartUI = (cart, products, listCartHTML, iconCart, iconCartSpan) => {
    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    saveCartToMemory(cart);
    if (iconCart) {
        triggerShakeAnimation(iconCart);
    }
    displayMessage('Item added to cart', 'success');
};