export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();

    navLinks.forEach(link => {
        const linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/\/$/, '').toLowerCase();

        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}