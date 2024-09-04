export const renderProductDetail = (product, container, addToCartCallback) => {
    container.innerHTML = ''; // Clear existing content

    const productDetail = document.createElement('div');
    productDetail.classList.add('item');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    productDetail.appendChild(img);

    const title = document.createElement('h2');
    title.textContent = product.title;
    productDetail.appendChild(title);

    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = product.description;
    productDetail.appendChild(description);

    const gender = document.createElement('div');
    gender.classList.add('gender');
    gender.textContent = `Gender: ${product.gender}`;
    productDetail.appendChild(gender);

    const color = document.createElement('div');
    color.classList.add('gender');
    color.textContent = `Color: ${product.baseColor}`;
    productDetail.appendChild(color);

    const price = document.createElement('div');
    price.classList.add('price');
    price.textContent = `$${product.price}`;
    productDetail.appendChild(price);

    const select = document.createElement('select');
    select.classList.add('sizeSelector');
    select.id = product.title;
    select.name = product.title;
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        select.appendChild(option);
    });
    productDetail.appendChild(select);

    const button = document.createElement('button');
    button.classList.add('addCart');
    button.dataset.id = product.id;
    button.textContent = 'Add To Cart';

    // Correctly add event listener
    button.addEventListener('click', () => {
        const selectedSize = select.value;
        console.log(`Button clicked for product ID=${product.id}, Size=${selectedSize}`); // Debugging line
        addToCartCallback(product.id, selectedSize);
    });

    productDetail.appendChild(button);
    container.appendChild(productDetail);
    container.style.display = 'block';
};

export const renderProductList = (products, container, addToCartCallback) => {
    container.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const newProduct = document.createElement('div');
        newProduct.dataset.id = product.id;
        newProduct.classList.add('item');

        const anchor = document.createElement('a');
        anchor.href = `index.html?id=${product.id}`;
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        anchor.appendChild(img);
        newProduct.appendChild(anchor);

        const title = document.createElement('h2');
        title.textContent = product.title;
        newProduct.appendChild(title);

        const description = document.createElement('div');
        description.classList.add('description');
        description.textContent = product.description;
        newProduct.appendChild(description);

        const price = document.createElement('div');
        price.classList.add('price');
        price.textContent = `$${product.price}`;
        newProduct.appendChild(price);

        const select = document.createElement('select');
        select.classList.add('sizeSelector');
        select.id = product.title;
        select.name = product.title;
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            select.appendChild(option);
        });
        newProduct.appendChild(select);

        const button = document.createElement('button');
        button.classList.add('addCart');
        button.dataset.id = product.id;
        button.textContent = 'Add To Cart';

        // Correctly add event listener using the provided callback
        button.addEventListener('click', () => {
            const selectedSize = select.value;
            console.log(`Button clicked for product ID=${product.id}, Size=${selectedSize}`); // Debugging line
            addToCartCallback(product.id, selectedSize);
        });

        newProduct.appendChild(button);
        container.appendChild(newProduct);
    });
};