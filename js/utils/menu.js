export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();

    // Detect if the current environment is GitHub Pages
    const isGitHubPages = currentPath.includes('/rainy-days');

    // Adjust current path if running on GitHub Pages by removing the base path '/rainy-days'
    if (isGitHubPages) {
        currentPath = currentPath.replace('/rainy-days', '');
    }

    navLinks.forEach(link => {
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/\/$/, '').toLowerCase();

        // Adjust link paths to exclude '/rainy-days' if on GitHub Pages
        if (isGitHubPages) {
            linkPath = linkPath.replace('/rainy-days', '');
        }

        // Special handling for the home page
        if ((link.getAttribute('href') === './' || link.getAttribute('href') === '/') && currentPath === '') {
            link.classList.add('active');
        } else if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}