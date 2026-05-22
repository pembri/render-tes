document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // Toggle Hamburger Menu untuk tampilan Mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Menutup menu jika klik di luar area navigasi
    document.addEventListener('click', (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
});
