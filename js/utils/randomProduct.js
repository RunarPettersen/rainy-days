export const updateDetailWithRandomProduct = (getRandomProduct, addProductToCart, detail) => {
    const thisProduct = getRandomProduct();

    if (!thisProduct || !thisProduct.image) {
        console.error('Invalid product returned by getRandomProduct:', thisProduct);
        return;
    }

    const mainImageContainer = detail.querySelector('.main-image');
    mainImageContainer.innerHTML = '';

    const anchor = document.createElement('a');
    anchor.href = `product/index.html?id=${thisProduct.id}`;

    const img = document.createElement('img');
    img.src = thisProduct.image;
    img.alt = thisProduct.title;

    anchor.appendChild(img);
    mainImageContainer.appendChild(anchor);

    const titleElement = detail.querySelector('.main-title h1');
    titleElement.innerText = thisProduct.title;

    const priceElement = detail.querySelector('.main-price');
    priceElement.innerText = '$' + thisProduct.price.toFixed(2);

    const descriptionElement = detail.querySelector('.main-description');
    descriptionElement.innerText = thisProduct.description;

    const sizeSelector = detail.querySelector('.sizeSelector');
    const uniqueSuffix = `${thisProduct.id}-${Date.now()}-${Math.random()}`;
    sizeSelector.id = `sizeSelector-${uniqueSuffix}`;
    sizeSelector.name = `size-${thisProduct.id}-${uniqueSuffix}`;

    sizeSelector.innerHTML = ''; 
    thisProduct.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelector.appendChild(option);
    });

    const addCartButton = detail.querySelector('.addCart');
    addCartButton.dataset.id = thisProduct.id;

    const newAddToCartHandler = () => {
        const selectedSize = sizeSelector.value;
        addProductToCart(thisProduct.id, selectedSize);
    };

    if (addCartButton._addToCartHandler) {
        addCartButton.removeEventListener('click', addCartButton._addToCartHandler);
    }

    addCartButton.addEventListener('click', newAddToCartHandler);
    addCartButton._addToCartHandler = newAddToCartHandler;
};