export const calculateFinalTotal = (checkoutShippingSelect, checkoutShippingCost, checkoutFinalTotal, checkoutTotalPrice) => {
    if (checkoutShippingSelect && checkoutShippingCost && checkoutFinalTotal) {
        let shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
        let cartTotalPrice = parseFloat(checkoutTotalPrice.innerText.replace('$', ''));
        let finalTotal = cartTotalPrice + shippingCost;

        checkoutShippingCost.innerText = `$${shippingCost.toFixed(2)}`;
        checkoutFinalTotal.innerText = `$${finalTotal.toFixed(2)}`;
    }
};

export const placeOrder = (cart, products, checkoutShippingSelect) => {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }

    const shippingCost = parseFloat(checkoutShippingSelect.selectedOptions[0].dataset.price);
    localStorage.setItem('shippingCost', shippingCost);

    const receipt = cart.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
            product_id: item.product_id,
            size: item.size,
            quantity: item.quantity,
            title: product.title,
            image: product.image,
            price: product.price
        };
    });
    localStorage.setItem('receipt', JSON.stringify(receipt));
    localStorage.removeItem('cart');

    window.location.href = 'confirmation/index.html';
};