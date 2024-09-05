export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();

    // Determine if running on GitHub Pages by checking if the pathname includes the repo name
    const isGitHubPages = currentPath.includes('/rainy-days');

    // If on GitHub Pages, adjust the current path to exclude the base path '/rainy-days'
    if (isGitHubPages) {
        currentPath = currentPath.replace('/rainy-days', '');
    }

    navLinks.forEach(link => {
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/\/$/, '').toLowerCase();

        // Adjust link paths to exclude '/rainy-days' when on GitHub Pages
        if (isGitHubPages) {
            linkPath = linkPath.replace('/rainy-days', '');
        }

        // Handling root paths correctly for relative links like './' or '../'
        if (link.getAttribute('href') === './' || link.getAttribute('href') === '/') {
            if (currentPath.includes('/product')) {
                linkPath = '/product';
            } else if (currentPath.includes('/about')) {
                linkPath = '/about';
            } else {
                linkPath = '/';
            }
        }

        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}