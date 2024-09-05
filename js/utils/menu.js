export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.toLowerCase();

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname.toLowerCase();

        // Debugging logs to see the paths being compared
        console.log(`Comparing: {link: '${linkPath}', current: '${currentPath}'}`);

        // Explicitly match each link to its corresponding path
        if (
            (linkPath === '/' && currentPath === '/') || // Home link
            (linkPath === '/product/' && currentPath.includes('/product')) || // Products link
            (linkPath === '/about/' && currentPath.includes('/about')) // About link
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}