import { saveCartToMemory } from './cartManager.js'; // Import saveCartToMemory
import { addCartToHTML } from './cart.js'; // Import addCartToHTML if not already imported

export const updateCheckoutPage = (cart, products, checkoutList, checkoutTotalQuantity, checkoutTotalPrice, calculateFinalTotal, removeFromCart, checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, listCartHTML, iconCartSpan) => {
    if (checkoutList) {
        checkoutList.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;

        if (cart.length > 0) {
            cart.forEach(item => {
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

                const img = document.createElement('img');
                img.src = info.image;
                img.alt = info.title;

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('info');

                const nameDiv = document.createElement('div');
                nameDiv.classList.add('name');
                nameDiv.textContent = info.title;

                const sizeDiv = document.createElement('div');
                sizeDiv.classList.add('size');
                sizeDiv.textContent = `Size: ${item.size}`;

                const priceDiv = document.createElement('div');
                priceDiv.classList.add('price');
                priceDiv.textContent = `$${info.price} / ${item.quantity} product(s)`;

                infoDiv.appendChild(nameDiv);
                infoDiv.appendChild(sizeDiv);
                infoDiv.appendChild(priceDiv);

                const quantityDiv = document.createElement('div');
                quantityDiv.classList.add('quantity');
                quantityDiv.textContent = item.quantity;

                const sidePanel = document.createElement('div');
                sidePanel.classList.add('sidepanel');

                const returnPriceDiv = document.createElement('div');
                returnPriceDiv.classList.add('returnPrice');
                returnPriceDiv.textContent = `$${(info.price * item.quantity).toFixed(2)}`;

                const removeButton = document.createElement('button');
                removeButton.classList.add('removeItem');
                removeButton.textContent = 'Remove';

                // Add event listener to remove button
                removeButton.addEventListener('click', () => {
                    // Remove item from cart
                    cart = removeFromCart(cart, item.product_id, item.size);
                    // Update UI and local storage
                    saveCartToMemory(cart); // Save the updated cart to memory
                    addCartToHTML(cart, products, listCartHTML, iconCartSpan); // Update cart display
                    updateCheckoutPage(cart, products, checkoutList, checkoutTotalQuantity, checkoutTotalPrice, calculateFinalTotal, removeFromCart, checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, listCartHTML, iconCartSpan);
                });

                sidePanel.appendChild(returnPriceDiv);
                sidePanel.appendChild(removeButton);

                newItem.appendChild(img);
                newItem.appendChild(infoDiv);
                newItem.appendChild(quantityDiv);
                newItem.appendChild(sidePanel);

                checkoutList.appendChild(newItem);

                totalPrice += info.price * item.quantity;
            });

            if (checkoutTotalQuantity) {
                checkoutTotalQuantity.innerText = totalQuantity;
            }
            if (checkoutTotalPrice) {
                checkoutTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
            }

            // Recalculate the final total with shipping
            calculateFinalTotal(checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, checkoutTotalPrice);

        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-cart-message');
            emptyMessage.innerText = 'No items in cart';
            checkoutList.appendChild(emptyMessage);
        }
    } else {
        console.error('checkoutList element not found');
    }
};