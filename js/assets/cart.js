export const addCartToHTML = (cart, products, listCartHTML, iconCartSpan) => {

    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cart.length > 0) {
        cart.forEach((item, index) => {
            totalQuantity += item.quantity;

            const newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;
            newItem.dataset.size = item.size;

            const positionProduct = products.findIndex(value => value.id == item.product_id);
            if (positionProduct === -1) {
                console.error('Product not found for cart item:', item);
                return;
            }

            const info = products[positionProduct];

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('image');

            const img = document.createElement('img');
            img.src = info.image;
            img.alt = info.title;
            imageDiv.appendChild(img);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('title');
            titleDiv.textContent = info.title;

            const sizeDiv = document.createElement('div');
            sizeDiv.classList.add('size');
            sizeDiv.textContent = `Size: ${item.size}`;

            const totalPriceDiv = document.createElement('div');
            totalPriceDiv.classList.add('totalPrice');
            totalPriceDiv.textContent = `$${(info.price * item.quantity).toFixed(2)}`;

            const quantityDiv = document.createElement('div');
            quantityDiv.classList.add('quantity', index % 2 === 0 ? 'odd' : 'even');

            const minusSpan = document.createElement('span');
            minusSpan.classList.add('minus');
            minusSpan.textContent = '<';

            const quantitySpan = document.createElement('span');
            quantitySpan.textContent = item.quantity;

            const plusSpan = document.createElement('span');
            plusSpan.classList.add('plus');
            plusSpan.textContent = '>';

            quantityDiv.appendChild(minusSpan);
            quantityDiv.appendChild(quantitySpan);
            quantityDiv.appendChild(plusSpan);

            newItem.appendChild(imageDiv);
            newItem.appendChild(titleDiv);
            newItem.appendChild(sizeDiv);
            newItem.appendChild(totalPriceDiv);
            newItem.appendChild(quantityDiv);

            listCartHTML.appendChild(newItem);

            totalPrice += info.price * item.quantity;
        });

        const totalDiv = document.createElement('div');
        totalDiv.classList.add('total');
        const totalHeader = document.createElement('h3');
        totalHeader.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        totalDiv.appendChild(totalHeader);
        listCartHTML.appendChild(totalDiv);
    } else {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('empty-cart-message');
        emptyMessage.textContent = 'Cart is empty';
        listCartHTML.appendChild(emptyMessage);
    }

    iconCartSpan.textContent = totalQuantity;

    setupCartEventListeners(cart, products, listCartHTML, iconCartSpan);
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