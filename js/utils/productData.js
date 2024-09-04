export const fetchProducts = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products. Please try again later.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const sortProductsByPrice = (products, order) => {
    products.sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
};

export const filterProductsByGender = (products, gender) => {
    return gender === 'all' ? products : products.filter(product => product.gender.toLowerCase() === gender);
};

export const getProductIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};