export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname;

    // Define the repo name if hosted on GitHub Pages
    const repoName = '/rainy-days'; // Adjust to your actual GitHub repository name

    // Remove the repo name if running on GitHub Pages
    if (currentPath.startsWith(repoName)) {
        currentPath = currentPath.slice(repoName.length);
    }

    // Ensure the current path is normalized: remove trailing slashes and make lowercase
    currentPath = currentPath.replace(/\/$/, '').toLowerCase();

    // Treat the root as '/'
    if (currentPath === '') {
        currentPath = '/';
    }

    navLinks.forEach(link => {
        // Get the href attribute and resolve it as an absolute path
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname;

        // Remove the repo name from link paths if necessary
        if (linkPath.startsWith(repoName)) {
            linkPath = linkPath.slice(repoName.length);
        }

        // Normalize link paths: remove trailing slashes and make lowercase
        linkPath = linkPath.replace(/\/$/, '').toLowerCase();

        // Treat the root as '/'
        if (linkPath === '') {
            linkPath = '/';
        }

        // Debugging log to see the comparison
        console.log('Comparing:', { link: linkPath, current: currentPath });

        // Add 'active' class if the paths match
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}