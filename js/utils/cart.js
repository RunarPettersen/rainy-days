export const addCartToHTML = (cart, products, listCartHTML, iconCartSpan) => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

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
            img.classList.add('cart-item-image');

            const title = document.createElement('div');
            title.textContent = product.title;
            title.classList.add('cart-item-title');

            const size = document.createElement('div');
            size.textContent = `Size: ${item.size}`;
            size.classList.add('cart-item-size');

            const quantity = document.createElement('div');
            quantity.classList.add('cart-item-quantity');

            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.classList.add('minus', 'quantity-button');
            minusButton.addEventListener('click', () => {
                changeQuantityCart(item.product_id, item.size, 'minus', cart, products, listCartHTML, iconCartSpan);
            });

            const quantityText = document.createElement('span');
            quantityText.textContent = item.quantity;
            quantityText.classList.add('quantity-text');

            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.classList.add('plus', 'quantity-button');
            plusButton.addEventListener('click', () => {
                changeQuantityCart(item.product_id, item.size, 'plus', cart, products, listCartHTML, iconCartSpan);
            });

            quantity.appendChild(minusButton);
            quantity.appendChild(quantityText);
            quantity.appendChild(plusButton);

            const itemTotalPrice = product.price * item.quantity;
            totalPrice += itemTotalPrice;

            const price = document.createElement('div');
            price.textContent = `$${itemTotalPrice.toFixed(2)}`;
            price.classList.add('cart-item-price');

            cartItem.appendChild(img);
            cartItem.appendChild(title);
            cartItem.appendChild(size);
            cartItem.appendChild(quantity);
            cartItem.appendChild(price);

            listCartHTML.appendChild(cartItem);
        });

        iconCartSpan.textContent = totalQuantity;

        const totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        totalDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        listCartHTML.appendChild(totalDiv);
    } else {
        listCartHTML.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        iconCartSpan.textContent = 0;
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