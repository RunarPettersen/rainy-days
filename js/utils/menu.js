export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname;

    // Detect if running on GitHub Pages by checking if the path includes the repo name (e.g., "/rainy-days")
    const repoName = '/rainy-days'; // Update this if your repo name is different
    const isGitHubPages = currentPath.includes(repoName);

    // Adjust paths for GitHub Pages by removing the repo name from the path
    if (isGitHubPages) {
        currentPath = currentPath.replace(repoName, '');
    }

    // Normalize current path (remove trailing slash, make lowercase)
    currentPath = currentPath.replace(/\/$/, '').toLowerCase() || '/';

    navLinks.forEach(link => {
        // Create a relative link path based on the link's href attribute
        let linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname;

        // Adjust link paths for GitHub Pages if necessary
        if (isGitHubPages) {
            linkPath = linkPath.replace(repoName, '');
        }

        // Normalize link path (remove trailing slash, make lowercase)
        linkPath = linkPath.replace(/\/$/, '').toLowerCase() || '/';

        // Debugging statements to compare paths
        console.log('Comparing:', { link: linkPath, current: currentPath });

        // Set the active class if paths match
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
