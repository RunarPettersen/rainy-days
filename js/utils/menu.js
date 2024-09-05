export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();

    // Normalize root path as home ('/' and './')
    if (currentPath === '' || currentPath === '/') {
        currentPath = '/';
    }

    navLinks.forEach(link => {
        // Convert each href to an absolute path for consistent comparison
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/\/$/, '').toLowerCase();

        // Handle special cases for './' to treat it as root or current page correctly
        if (link.getAttribute('href') === './' || link.getAttribute('href') === '/') {
            if (window.location.pathname === '/product/' || window.location.pathname === '/product') {
                linkPath = '/product';
            } else if (window.location.pathname === '/about/' || window.location.pathname === '/about') {
                linkPath = '/about';
            } else {
                linkPath = '/';
            }
        }

        // Compare and set active class
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}