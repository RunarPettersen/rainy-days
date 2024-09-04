export const updateDetailWithRandomProduct = (getRandomProduct, addProductToCart, detail) => {
    const thisProduct = getRandomProduct();

    if (!thisProduct || !thisProduct.image) {
        console.error('Invalid product returned by getRandomProduct:', thisProduct);
        return;
    }

    const anchor = document.createElement('a');
    anchor.href = `product/index.html?id=${thisProduct.id}`;

    const img = document.createElement('img');
    img.src = thisProduct.image;
    img.alt = thisProduct.title;

    anchor.appendChild(img);

    const mainImageContainer = detail.querySelector('.main-image');
    mainImageContainer.innerHTML = '';
    mainImageContainer.appendChild(anchor);

    const uniqueSuffix = `${thisProduct.id}-${Date.now()}`;

    const titleElement = detail.querySelector('.main-title h1');
    titleElement.id = `product-title-${uniqueSuffix}`;
    titleElement.innerText = thisProduct.title;

    const priceElement = detail.querySelector('.main-price');
    priceElement.id = `product-price-${uniqueSuffix}`;
    priceElement.innerText = '$' + thisProduct.price.toFixed(2);

    const descriptionElement = detail.querySelector('.main-description');
    descriptionElement.id = `product-description-${uniqueSuffix}`;
    descriptionElement.innerText = thisProduct.description;

    const sizeSelector = detail.querySelector('.sizeSelector');
    sizeSelector.id = `sizeSelector-${uniqueSuffix}`;
    sizeSelector.name = `size-${thisProduct.id}`;

    sizeSelector.innerHTML = thisProduct.sizes.map(size => `<option value="${size}">${size}</option>`).join('');

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