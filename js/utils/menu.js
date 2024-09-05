export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.toLowerCase();

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname.toLowerCase();

        if (
            (linkPath === '/' && currentPath === '/') ||
            (linkPath === '/product/' && currentPath.includes('/product')) ||
            (linkPath === '/about/' && currentPath.includes('/about'))
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}