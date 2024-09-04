export const addCartToHTML = (cart, products, listCartHTML, iconCartSpan) => {
    listCartHTML.innerHTML = ''; // Clear the current cart display
    let totalQuantity = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (!product) return;

            totalQuantity += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.product_id;
            cartItem.dataset.size = item.size;

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            img.classList.add('cart-item-image'); // Add appropriate CSS class

            const title = document.createElement('div');
            title.textContent = product.title;
            title.classList.add('cart-item-title'); // Add appropriate CSS class

            const size = document.createElement('div');
            size.textContent = `Size: ${item.size}`;
            size.classList.add('cart-item-size'); // Add appropriate CSS class

            const quantity = document.createElement('div');
            quantity.classList.add('cart-item-quantity'); // Add appropriate CSS class

            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.classList.add('minus', 'quantity-button'); // Add appropriate CSS classes
            minusButton.addEventListener('click', () => {
                changeQuantityCart(item.product_id, item.size, 'minus', cart, products, listCartHTML, iconCartSpan);
            });

            const quantityText = document.createElement('span');
            quantityText.textContent = item.quantity;
            quantityText.classList.add('quantity-text'); // Add appropriate CSS class

            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.classList.add('plus', 'quantity-button'); // Add appropriate CSS classes
            plusButton.addEventListener('click', () => {
                changeQuantityCart(item.product_id, item.size, 'plus', cart, products, listCartHTML, iconCartSpan);
            });

            quantity.appendChild(minusButton);
            quantity.appendChild(quantityText);
            quantity.appendChild(plusButton);

            const price = document.createElement('div');
            price.textContent = `$${(product.price * item.quantity).toFixed(2)}`;
            price.classList.add('cart-item-price'); // Add appropriate CSS class

            cartItem.appendChild(img);
            cartItem.appendChild(title);
            cartItem.appendChild(size);
            cartItem.appendChild(quantity);
            cartItem.appendChild(price);

            listCartHTML.appendChild(cartItem);
        });

        // Update cart icon quantity
        iconCartSpan.textContent = totalQuantity;
    } else {
        listCartHTML.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        iconCartSpan.textContent = 0;
    }
};

const setupCartEventListeners = (cart, products, listCartHTML, iconCartSpan) => {
    if (!listCartHTML.listenerAttached) {
        listCartHTML.addEventListener('click', (event) => {
            const positionClick = event.target;

            if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
                const product_id = positionClick.closest('.item').dataset.id;
                const size = positionClick.closest('.item').dataset.size;
                let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';

                changeQuantityCart(product_id, size, type, cart, products, listCartHTML, iconCartSpan);
            }
        });

        listCartHTML.listenerAttached = true;
    }
};

export const changeQuantityCart = (product_id, size, type, cart, products, listCartHTML, iconCartSpan) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id && value.size == size);
    if (positionItemInCart >= 0) {
        let item = cart[positionItemInCart];
        if (type === 'plus') {
            item.quantity += 1;
        } else if (type === 'minus') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart.splice(positionItemInCart, 1);
            }
        }
    }

    addCartToHTML(cart, products, listCartHTML, iconCartSpan);
    localStorage.setItem('cart', JSON.stringify(cart));
};