document.addEventListener('DOMContentLoaded', function() {
    const leftCurtain = document.querySelector('.left-curtain');
    const rightCurtain = document.querySelector('.right-curtain');

    // Function to handle scroll animation
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.min(scrollPosition / (windowHeight * 0.5), 1);

        // Apply transform based on scroll percentage
        leftCurtain.style.transform = `translateX(${-100 * scrollPercentage}%)`;
        rightCurtain.style.transform = `translateX(${100 * scrollPercentage}%)`;
    }

    // Initial call to set starting position
    handleScroll();

    // Add scroll event listener for curtain animation
    window.addEventListener('scroll', handleScroll);

    // Add resize event listener to handle window resizing
    window.addEventListener('resize', handleScroll);
});
