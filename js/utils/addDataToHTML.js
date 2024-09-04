export const addDataToHTML = (products, listProductHTML, addProductToCart) => {
    if (products.length > 0) {
        listProductHTML.innerHTML = '';
        products.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');

            const anchor = document.createElement('a');
            anchor.href = `product/index.html?id=${product.id}`;

            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            anchor.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = product.title;

            const price = document.createElement('div');
            price.classList.add('price');
            price.textContent = `$${product.price}`;

            const select = document.createElement('select');
            select.classList.add('sizeSelector');
            select.setAttribute('aria-label', 'Size selector');
            select.id = `sizeSelector-${product.id}-${Date.now()}`;
            select.name = `size-${product.id}`;
            product.sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                select.appendChild(option);
            });

            const button = document.createElement('button');
            button.classList.add('addCart');
            button.textContent = 'Add To Cart';

            button.addEventListener('click', () => addProductToCart(product.id, select.value));

            newProduct.appendChild(anchor);
            newProduct.appendChild(title);
            newProduct.appendChild(price);
            newProduct.appendChild(select);
            newProduct.appendChild(button);

            listProductHTML.appendChild(newProduct);
        });
    } else {
        console.error('No products available');
    }
};