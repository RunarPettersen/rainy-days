export const setupCartIcon = () => {
    const iconCart = document.querySelector('.icon-cart');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');

    if (iconCart) {
        iconCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    } else {
        console.error('iconCart element not found');
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            body.classList.toggle('showCart');
        });
    } else {
        console.error('closeCart element not found');
    }
};

export const triggerShakeAnimation = (element) => {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
};