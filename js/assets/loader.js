export function setupLoader() {
    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");

        if (loader) {
            loader.classList.add("loader-hidden");

            loader.addEventListener("transitionend", () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            });
        } else {
            console.error('Loader element not found');
        }
    });
}