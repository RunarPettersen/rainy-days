export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();

    if (currentPath === '') currentPath = '/';

    navLinks.forEach(link => {
        let linkPath = link.getAttribute('href').replace(/\/$/, '').toLowerCase();

        if (linkPath === './') linkPath = '/';
        if (!linkPath.startsWith('/')) linkPath = '/' + linkPath;

        linkPath = linkPath.replace(/\/$/, '').toLowerCase();
        
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}