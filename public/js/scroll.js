const scrollButton = document.getElementById('scrollToTopBtn');

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
    });
});
