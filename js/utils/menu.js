export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Extract base path from GitHub Pages, e.g., "/rainy-days"
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');

    // Get the normalized current path relative to basePath
    let currentPath = window.location.pathname.replace(basePath, '').replace(/\/$/, '').toLowerCase();

    // Treat empty paths as root ('/')
    if (currentPath === '') {
        currentPath = '/';
    }

    navLinks.forEach(link => {
        // Normalize link paths to compare correctly
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(basePath, '').replace(/\/$/, '').toLowerCase();

        // Treat empty paths as root ('/')
        if (linkPath === '') {
            linkPath = '/';
        }

        // Debugging logs
        console.log(`Comparing: {link: '${linkPath}', current: '${currentPath}'}`);

        // Compare and set 'active' class
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}