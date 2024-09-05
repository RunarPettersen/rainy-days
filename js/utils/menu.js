export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname;

    // Check if on GitHub Pages by looking for "/rainy-days" in the path
    const isGitHubPages = currentPath.includes('/rainy-days');

    navLinks.forEach(link => {
        // Get the relative path of the link href
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname;

        // Adjust paths if running on GitHub Pages
        if (isGitHubPages) {
            currentPath = currentPath.replace('/rainy-days', '');
            linkPath = linkPath.replace('/rainy-days', '');
        }

        // Remove trailing slashes for consistency
        currentPath = currentPath.replace(/\/$/, '').toLowerCase();
        linkPath = linkPath.replace(/\/$/, '').toLowerCase();

        // Set active class based on matching paths
        if ((currentPath === '' || currentPath === '/') && (link.getAttribute('href') === './' || link.getAttribute('href') === '/')) {
            link.classList.add('active');
        } else if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}