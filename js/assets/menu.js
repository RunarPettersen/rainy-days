export function setActiveLink() {
    const navLinks = document.querySelectorAll('.nav-link');

    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}